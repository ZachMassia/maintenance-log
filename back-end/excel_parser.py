import datetime

import openpyxl as xl


class Tractor:
    SHEET_NAME = 'Tractors'

    Columns = {'unit_num':              0,
               'a_pm_date':             8,
               'b_pm_km_until_next':    9,
               'safety_date':          10}


class Trailer:
    SHEET_NAME = 'Trailers'

    Columns = {'unit_num':        0,
               't_pm_date':      10,
               'safety_date':    11,
               'one_year_date':  12,
               'five_year_date': 13}


class Truck:
    SHEET_NAME = 'Trucks'

    Columns = {'unit_num':        0,
               'a_pm_date':      14,
               'b_pm_date':      15,
               'safety_date':    16,
               'one_year_date':  17,
               'five_year_date': 18}

division_headers = ['1 Maxville', '2 Chesterville', '6 Bourget', '9 Cornwall',
                    '10 Lube', '4 Athens', '7 Kempville', '8 Pembroke', 'Picton',
                    'DEF Div', 'Pick Ups', 'air comp.', 'T42', 'T-40', '1054', '1056',
                    '1066', '1062', '1067', '1068', '1069', '1074', '43', '1078' ]

start_row = 3


def convert_num_days_to_date(units):
    """Convert the raw day numbers from Excel to python Date objects."""
    converted_units = []
    today = datetime.date.today()

    for unit in units:
        x = {}
        for column_name, value in unit.items():
            if column_name == 'unit_num':
                x[column_name] = value
            elif column_name == 'b_pm_km_until_next':
                x[column_name] = value # Tractor BPM in KM, not a date.
            elif value and value != '#VALUE!':
                delta = datetime.timedelta(days=value)
                x[column_name] = today + delta
            else:
                x[column_name] = None
        converted_units.append(x)

    return converted_units


def parse(wb, unit_type):
    """Given a workbook and a unit type class, will return a list of unit dicts."""
    sheet = wb[unit_type.SHEET_NAME]

    units = []
    for row in sheet.rows[start_row:]:
        unit = {}

        # Ignore any division headers
        if row[0].value in division_headers:
            continue

        if not row[unit_type.Columns['unit_num']].value:
            continue

        for field_name, index in unit_type.Columns.items():
            unit[field_name] = row[index].value

        units.append(unit)

    return convert_num_days_to_date(units)
