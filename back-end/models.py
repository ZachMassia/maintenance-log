from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Unit(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    type     = db.Column(db.Unicode)
    unit_num = db.Column(db.Unicode, unique=True)

    # If any of the default intervals are overridden, they will be referenced here.
    intervals = db.relationship('IntervalOverride', backref="unit")

    __mapper_args__ = {
        'polymorphic_identity': 'unit',
        'polymorphic_on': type
    }


class Tractor(Unit):
    id                 = db.Column(db.Integer, db.ForeignKey('unit.id'), primary_key=True)
    a_pm_date          = db.Column(db.Date, nullable=True)
    b_pm_km_until_next = db.Column(db.Integer)
    safety_date        = db.Column(db.Date, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'tractor',
    }


class Trailer(Unit):
    id             = db.Column(db.Integer, db.ForeignKey('unit.id'), primary_key=True)
    t_pm_date      = db.Column(db.Date, nullable=True)
    safety_date    = db.Column(db.Date, nullable=True)
    one_year_date  = db.Column(db.Date, nullable=True)
    five_year_date = db.Column(db.Date, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'trailer',
    }


class Truck(Unit):
    id             = db.Column(db.Integer, db.ForeignKey('unit.id'), primary_key=True)
    a_pm_date      = db.Column(db.Date, nullable=True)
    b_pm_date      = db.Column(db.Date, nullable=True)
    safety_date    = db.Column(db.Date, nullable=True)
    one_year_date  = db.Column(db.Date, nullable=True)
    five_year_date = db.Column(db.Date, nullable=True)
    oil_cal_date   = db.Column(db.Date, nullable=True)
    gas_cal_date   = db.Column(db.Date, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'truck',
    }


class DefaultInterval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_type = db.Column(db.Unicode)
    service_type = db.Column(db.Unicode)
    interval = db.Column(db.Integer)


class IntervalOverride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_type = db.Column(db.Unicode)
    service_type = db.Column(db.Unicode)
    interval = db.Column(db.Integer)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'))
