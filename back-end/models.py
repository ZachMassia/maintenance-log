from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Tractor(db.Model):
    id                 = db.Column(db.Integer, primary_key=True)
    unit_num           = db.Column(db.Unicode, unique=True)
    a_pm_date          = db.Column(db.Date, nullable=True)
    b_pm_km_until_next = db.Column(db.Integer)
    safety_date        = db.Column(db.Date, nullable=True)


class Trailer(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    unit_num       = db.Column(db.Unicode, unique=True)
    t_pm_date      = db.Column(db.Date, nullable=True)
    safety_date    = db.Column(db.Date, nullable=True)
    one_year_date  = db.Column(db.Date, nullable=True)
    five_year_date = db.Column(db.Date, nullable=True)


class Truck(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    unit_num       = db.Column(db.Unicode, unique=True)
    a_pm_date      = db.Column(db.Date, nullable=True)
    b_pm_date      = db.Column(db.Date, nullable=True)
    safety_date    = db.Column(db.Date, nullable=True)
    one_year_date  = db.Column(db.Date, nullable=True)
    five_year_date = db.Column(db.Date, nullable=True)
    oil_cal_date   = db.Column(db.Date, nullable=True)
    gas_cal_date   = db.Column(db.Date, nullable=True)


class DefaultInterval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_type = db.Column(db.Unicode)
    service_type = db.Column(db.Unicode)
    interval = db.Column(db.Integer)


class IntervalOverride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_type = db.Column(db.Unicode)
    service_type = db.Column(db.Unicode)
    # unit_id = TODO: Find way to reference ID from any table, or create single "Unit table"
    interval = db.Column(db.Integer)
