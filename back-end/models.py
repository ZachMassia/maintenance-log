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
    a_pm_date          = db.Column(db.Date,    nullable=True)
    current_km         = db.Column(db.Integer, nullable=True)
    b_pm_km_until_next = db.Column(db.Integer, nullable=True)
    safety_date        = db.Column(db.Date,    nullable=True)

    defaults = {
        'a_pm':   60,
        'b_pm':   40000,
        'safety': 365
    }

    __mapper_args__ = {
        'polymorphic_identity': 'tractor',
    }


class Trailer(Unit):
    id             = db.Column(db.Integer, db.ForeignKey('unit.id'), primary_key=True)
    t_pm_date      = db.Column(db.Date, nullable=True)
    safety_date    = db.Column(db.Date, nullable=True)
    one_year_date  = db.Column(db.Date, nullable=True)
    five_year_date = db.Column(db.Date, nullable=True)

    defaults = {
        't_pm':      30,
        'safety':    365,
        'one_year':  365,
        'five_year': 1825
    }

    __mapper_args__ = {
        'polymorphic_identity': 'trailer',
    }


class Truck(Unit):
    id               = db.Column(db.Integer, db.ForeignKey('unit.id'), primary_key=True)
    a_pm_date        = db.Column(db.Date,    nullable=True)
    b_pm_date        = db.Column(db.Date,    nullable=True)
    b_pm_last_km     = db.Column(db.Integer, nullable=True)
    safety_date      = db.Column(db.Date,    nullable=True)
    one_year_date    = db.Column(db.Date,    nullable=True)
    five_year_date   = db.Column(db.Date,    nullable=True)
    oil_cal_date     = db.Column(db.Date,    nullable=True)
    gas_cal_date     = db.Column(db.Date,    nullable=True)
    propane_cal_date = db.Column(db.Date,    nullable=True)
    is_propane       = db.Column(db.Boolean, nullable=True)  # TODO: Make required, and set appropriately

    defaults = {
        'a_pm':        30,
        'b_pm':        90,
        'safety':      365,
        'one_year':    365,
        'five_year':   1825,
        'oil_cal':     730,
        'gas_cal':     730,
        'propane_cal': 365
    }

    __mapper_args__ = {
        'polymorphic_identity': 'truck',
    }


class DefaultInterval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_type = db.Column(db.Unicode)
    service_type = db.Column(db.Unicode)
    interval = db.Column(db.Integer)

    # Ensure at the DB level that we cannot have multiple defaults for the same service & unit
    # type combo.
    __table_args__ = (
        db.UniqueConstraint('service_type', 'unit_type', name='service_type_unit_type_default_uc'),
    )


class IntervalOverride(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.Unicode)
    interval = db.Column(db.Integer)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'))

    # Ensure at the DB level that we cannot have multiple intervals for the same service type on
    # a given unit.
    __table_args__ = (
        db.UniqueConstraint('service_type', 'unit_id', name='unit_id_service_type_override_uc'),
    )
