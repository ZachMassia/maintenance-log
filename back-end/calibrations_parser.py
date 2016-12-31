from datetime import datetime
from itertools import islice

import openpyxl as xl

SHEET_NAME = 'Sheet1'
START_ROW = 2

COLUMNS = {
    'unit_num': 0,
    'gas_cal_date': 5,
    'oil_cal_date': 6,
    'propane_cal_date': 7
}


def filter_invalid_data(units):
    """Make sure any empty or invalid cells have the value None.

    Also returns the data as a dict of unit_num -> unit_dict.
    """
    filtered_units = {}

    for unit in units:
        x = {}
        num = str(unit['unit_num'])
        for column_name, value in unit.items():
            if column_name == 'unit_num':
                pass # Leave out the unit num as the data is in a dict with unit_num keys.
            elif type(value) is datetime:
                # Convert the datetime object to a date object.
                x[column_name] = value.date()
            else:
                x[column_name] = None

        filtered_units[num] = x
    return filtered_units


def parse(wb):
    sheet = wb[SHEET_NAME]

    units = []

    for row in islice(sheet.rows, START_ROW, None):
        unit = {}

        unit_num = row[COLUMNS['unit_num']].value
        if not unit_num:
            # Skip empty row
            continue

        for field_name, index in COLUMNS.items():
            unit[field_name] = row[index].value
        units.append(unit)

    return filter_invalid_data(units)
