import numbers
from datetime import datetime
from itertools import islice

import openpyxl as xl


class Tractor:
    SHEET_NAME = 'Tractors'

    Columns = {
        'unit_num':           0,
        'current_km':         1,
        'a_pm_date':          2,
        'b_pm_km_until_next': 3,
        'safety_date':        4
    }

    IntervalColumns = {
        'a_pm': 14,
        'b_pm': 15
    }

    start_row = 2


class Trailer:
    SHEET_NAME = 'Trailers'

    Columns = {
        'unit_num':       0,
        't_pm_date':      2,
        'safety_date':    3,
        'one_year_date':  4,
        'five_year_date': 5
    }

    IntervalColumns = {
        't_pm': 17,
    }

    start_row = 2


class Truck:
    SHEET_NAME = 'Trucks'

    Columns = {
        'unit_num':       0,
        'a_pm_date':      2,
        'b_pm_date':      3,
        'b_pm_last_km':   1,
        'safety_date':    4,
        'one_year_date':  5,
        'five_year_date': 6
    }

    IntervalColumns = {
        'a_pm':      25,
        'b_pm':      26,
    }

    start_row = 3


ignored_rows = ['1 Maxville', '2 Chesterville', '6 Bourget', '9 Cornwall',
                    '10 Lube', '4 Athens', '7 Kempville', '8 Pembroke', 'Picton',
                    'DEF Div', 'Pick Ups', 'air comp.', 'T42', 'T-40', 1054, 1056,
                    1066, 1062, 1067, 1068, 1069, 1074, 43, 1078, 'Timmins' ]



def filter_invalid_data(units):
    """Make sure any empty or invalid cells have the value None.

    For example, some units have the string "N/A" in a what should be a date cell, such as the
    B620 column for a boom truck.
    """
    filtered_units = []

    # The following columns pass through as-is.
    as_is_columns = [
        'b_pm_km_until_next',
        'b_pm_last_km',
        'current_km'
    ]

    for unit in units:
        x = {}
        for column_name, value in unit.items():
            if column_name in as_is_columns:
                x[column_name] = value
            elif column_name == 'unit_num':
                # Convert the unit num to a string.
                # Tractor and Truck unit numbers come through as ints, but they are stored as
                # Unicode in the db.
                # Remove any extras such as '- Propane' from the end of the string.
                x[column_name] = str(value).split(' - ')[0]
            elif type(value) is not datetime:
                # At this point, if it's not a datetime object, it's most likely a cell in one of
                # the date columns which is blank, or has "N/A", so pass it through as None.
                x[column_name] = None
            elif value:
                # Convert the datetime object to date object, as we don't care about the time.
                x[column_name] = value.date()
            else:
                x[column_name] = None
        filtered_units.append(x)

    return filtered_units


def parse(wb, unit_type):
    """Given a workbook and a unit type class, will return a list of unit dicts."""
    sheet = wb[unit_type.SHEET_NAME]

    units = []
    intervals = []

    for row in islice(sheet.rows, unit_type.start_row, None):
        unit = {}
        interval = {}

        # Ignore any division headers
        if row[0].value in ignored_rows:
            continue

        unit_num = row[unit_type.Columns['unit_num']].value
        if not unit_num:
            continue

        for field_name, index in unit_type.Columns.items():
            unit[field_name] = row[index].value
        units.append(unit)

        for field_name, index in unit_type.IntervalColumns.items():
            interval[field_name] = row[index].value
            interval['unit_num'] = str(unit_num)
        intervals.append(interval)


    return {
        'units':     filter_invalid_data(units),
        'intervals': intervals
    }
