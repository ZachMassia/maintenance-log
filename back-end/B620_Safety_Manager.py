import os
import sys
import time
import warnings
from configparser import ConfigParser
from datetime import datetime, timedelta

import flask
import flask_restless
import flask_sqlalchemy
import openpyxl as xl
from flask_cors import CORS
from sqlalchemy.sql.expression import ClauseElement

import calibrations_parser as cal_parser
import excel_parser as parser
from models import (DefaultInterval, IntervalOverride, Tractor, Trailer, Truck,
                    db)
from utils import update_or_create_unit

# Store the root folder of the project.
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

# Parse the config file.
cfg_parser = ConfigParser()
cfg_parser.read(os.path.join(__location__, 'serverconfig.ini'))

MAINT_EXCEL_PATH = cfg_parser.get('file_paths', 'maint_excel_path')
CAL_EXCEL_PATH = cfg_parser.get('file_paths', 'cal_excel_path')
DB_PATH = cfg_parser.get('file_paths', 'db_path')
CACHE_TIME = timedelta(minutes=cfg_parser.getint('settings', 'cache_time'))
THREADED = cfg_parser.get('settings', 'threaded')
VERBOSE = cfg_parser.get('settings', 'verbose')


# Create the flask application.
app = flask.Flask(__name__)
app.config['DEBUG'] = cfg_parser.get('settings', 'debug')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(DB_PATH)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
cors = CORS(app, resources={r'/api/*': {'origins': '*'}})


# Store the time a given unit type was last refreshed.
last_data_refresh = {
    'Tractor': None,
    'Trailer': None,
    'Truck':   None,
}


def parse_unit_and_update_db(unit_type, workbook, cal_workbook, db_session):
    """Parses the Excel file for given unit type and update the DB."""
    # TODO: The following is a bit hackish. Could use some refactoring.
    #       Because we have both an SQLAlchemy model class and an Excel parser info class,
    #       we must pass the Excel variant to the parse function while keeping the SQLAlchemy
    #       variant (the one passed to the fn) around as well.
    parser_unit_class_obj = getattr(sys.modules['excel_parser'], unit_type.__name__)

    # Parse the Excel file.
    results = parser.parse(workbook, parser_unit_class_obj)
    cal_results = cal_parser.parse(cal_workbook)

    # For each parsed unit, either update the record in the DB, or create a new one.
    for unit in results['units']:
        unit_instance = update_or_create_unit(db_session, unit_type, VERBOSE, **unit)
        unit_num = unit['unit_num']
        if unit_num in cal_results:
            for k, v in cal_results[unit_num].items():
                old_val = getattr(unit_instance, k)
                if old_val != v:
                    print('Updated {} for unit {}:\t{}\t-->\t{}'.format(k, unit_num, old_val, v))
            setattr(unit_instance, k, v) # TODO: This doesn't seem to be saved to the DB.
    db_session.commit()

    # Update last refresh time.
    last_data_refresh[unit_type.__name__] = datetime.now()

    if VERBOSE:
        print('Parsed and updated {} {} records.'.format(len(results['units']), unit_type.__name__))


def update_all_unit_types(workbook, cal_workbook, db_session):
    """Parses and updates all unit types.

    Mainly to bulk update on server startup or client requested refresh.
    """
    for unit in [Tractor, Trailer, Truck]:
        parse_unit_and_update_db(unit, workbook, cal_workbook, db_session)


def populate_default_intervals(db_session):
    """Populate the default intervals table if it is empty.

    Any further changes to these values should be done from the web configuration.
    """
    for unit in [Tractor, Trailer, Truck]:
        for service_type, interval in unit.defaults.items():
            row = DefaultInterval(
                unit_type    = unit.__tablename__,
                service_type = service_type,
                interval     = interval
            )
            db_session.add(row)

    db_session.commit()

    print('Default intervals table populated.')


def create_preprocessor(unit_type, workbook, db_session):
    """Creates and returns a flask-restless preprocessor function."""
    def fn(**kwargs):
        # Only update the DB if the cache is expired.
        if datetime.now() - last_data_refresh[unit_type.__name__] > CACHE_TIME:
            parse_unit_and_update_db(unit_type, workbook, db_session)

    return fn


def create_api_endpoint(api_manager, unit_type, workbook, db_session):
    """Register the model with flask-restless."""
    api_manager.create_api(unit_type,
                           methods=['GET'],
                           results_per_page=-1,
                           preprocessors={
                               'GET_SINGLE': [create_preprocessor(unit_type, workbook, db_session)],
                               'GET_MANY':   [create_preprocessor(unit_type, workbook, db_session)]
                           })


def main():
    # Ignore openpyxl warnings.
    warnings.filterwarnings("ignore")

    # Load the Excel file.
    workbook = xl.load_workbook(MAINT_EXCEL_PATH, data_only=True)
    cal_workbook = xl.load_workbook(CAL_EXCEL_PATH, data_only=True)

    # Create the Flask-Restless API manager.
    manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

    # Create the database tables.
    with app.app_context():
        db.init_app(app)
        db.create_all()

        # Populate the default intervals if this is a fresh DB.
        if DefaultInterval.query.count() <= 0:
            populate_default_intervals(db.session)

        # Update the database.
        update_all_unit_types(workbook, cal_workbook, db.session)


        # Create the API endpoints.
        for unit in [Tractor, Trailer, Truck]:
            create_api_endpoint(manager, unit, workbook, db.session)

        manager.create_api(DefaultInterval,
                           methods=['GET', 'PATCH'],
                           results_per_page=-1)

        manager.create_api(IntervalOverride,
                           methods=['GET', 'PATCH', 'POST', 'DELETE'],
                           results_per_page=-1)

        # Start serving the endpoints.
        app.run(host='0.0.0.0', threaded=THREADED)


if __name__ == '__main__':
    main()
