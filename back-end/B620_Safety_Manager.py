import sys, os, time, warnings
import openpyxl as xl
import flask, flask_restless, flask_sqlalchemy
from sqlalchemy.sql.expression import ClauseElement
from configparser import ConfigParser
from datetime import datetime, timedelta

import excel_parser as parser
from models import Tractor, Trailer, Truck, db


# Parse the config file.
cfg_parser = ConfigParser()
cfg_parser.read('serverconfig.ini')

MAINT_EXCEL_PATH = cfg_parser.get('file_paths', 'maint_excel_path')
DB_PATH = cfg_parser.get('file_paths', 'db_path')
CACHE_TIME = timedelta(minutes=cfg_parser.getint('settings', 'cache_time'))


# Create the flask application.
app = flask.Flask(__name__)
app.config['DEBUG'] = cfg_parser.get('settings', 'debug')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(DB_PATH)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Store the time a given unit type was last refreshed.
last_data_refresh = {
    'Tractor': None,
    'Trailer': None,
    'Truck':   None,
}


def update_or_create(session, model, **kwargs):
    """Update the model instance if found, otherwise create a new one."""
    # Try to find a model with the given unit #.
    instance = session.query(model).filter_by(unit_num=kwargs['unit_num']).first()
    if instance:
        for k, v in kwargs.items():
            setattr(instance, k, v)
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        print('New unit added: {}'.format(kwargs['unit_num']))
        return instance


def parse_unit_and_update_db(unit_type, workbook, db_session):
    """Parses the Excel file for given unit type and update the DB."""
    # TODO: The following is a bit hackish. Could use some refactoring.
    #       Because we have both an SQLAlchemy model class and an Excel parser info class,
    #       we must pass the Excel variant to the parse function while keeping the SQLAlchemy
    #       variant (the one passed to the fn) around as well.
    parser_unit_class_obj = getattr(sys.modules['excel_parser'], unit_type.__name__)

    # Parse the Excel file.
    results = parser.parse(workbook, parser_unit_class_obj)

    # For each parsed unit, either update the record in the DB, or create a new one.
    with app.app_context():
        for unit in results:
            update_or_create(db_session, unit_type, **unit)
        db_session.commit()

    # Update last refresh time.
    last_data_refresh[unit_type.__name__] = datetime.now()

    print('Parsed and updated {} {} records.'.format(len(results), unit_type.__name__))


def update_all_unit_types(workbook, db_session):
    """Parses and updates all unit types.

    Mainly to bulk update on server startup or client requested refresh.
    """
    for unit in [Tractor, Trailer, Truck]:
        parse_unit_and_update_db(unit, workbook, db_session)


def create_preprocessor(unit_type, workbook, db_session):
    """Creates and returns a flask-restless preprocessor function."""
    def fn(**kwargs):
        # Only update the DB if the cache is expired.
        if datetime.now() - last_data_refresh[unit_type.__name__] > CACHE_TIME:
            parse_unit_and_update_db(unit_type, workbook, db_session)

    return fn

def main():
    # Ignore openpyxl warnings.
    warnings.filterwarnings("ignore")

    # Load the Excel file.
    workbook = xl.load_workbook(MAINT_EXCEL_PATH, data_only=True)

    # Create the Flask-Restless API manager.
    manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

    # Create the database tables.
    with app.app_context():
        db.init_app(app)
        db.create_all()

    # Update the database.
    update_all_unit_types(workbook, db.session)

    # Create the API endpoints.
    manager.create_api(Tractor,
                       methods=['GET'],
                       results_per_page=-1,
                       preprocessors={
                           'GET_SINGLE': [create_preprocessor(Tractor, workbook, db.session)],
                           'GET_MANY':   [create_preprocessor(Tractor, workbook, db.session)]
                       })

    manager.create_api(Trailer,
                       methods=['GET'],
                       results_per_page=-1,
                       preprocessors={
                           'GET_SINGLE': [create_preprocessor(Trailer, workbook, db.session)],
                           'GET_MANY':   [create_preprocessor(Trailer, workbook, db.session)]
                       })

    manager.create_api(Truck,
                       methods=['GET'],
                       results_per_page=-1,
                       preprocessors={
                           'GET_SINGLE': [create_preprocessor(Truck, workbook, db.session)],
                           'GET_MANY':   [create_preprocessor(Truck, workbook, db.session)]
                       })

    # Start serving the endpoints.
    app.run()


if __name__ == '__main__':
    main()
