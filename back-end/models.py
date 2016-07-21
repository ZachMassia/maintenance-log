from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Tractor(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    unit_num    = db.Column(db.Unicode, unique=True)
    a_pm_date   = db.Column(db.Date)
    b_pm_date   = db.Column(db.Integer)
    safety_date = db.Column(db.Date)


class Trailer(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    unit_num       = db.Column(db.Unicode, unique=True)
    t_pm_date      = db.Column(db.Date)
    safety_date    = db.Column(db.Date)
    one_year_date  = db.Column(db.Date)
    five_year_date = db.Column(db.Date)


class Truck(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    unit_num       = db.Column(db.Unicode, unique=True)
    a_pm_date      = db.Column(db.Date)
    b_pm_date      = db.Column(db.Date)
    safety_date    = db.Column(db.Date)
    one_year_date  = db.Column(db.Date)
    five_year_date = db.Column(db.Date)
    oil_cal_date   = db.Column(db.Date)
    gas_cal_date   = db.Column(db.Date)
