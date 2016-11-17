import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';


import { UNIT_TYPES, DB_DATE_FORMAT } from '../constants';
import { UnitTypePicker } from '../components';
import { fetchUnitsIfNeeded } from '../actions';

function dateFormatter(cell) {
  if (cell) {
    return moment(cell, DB_DATE_FORMAT).format('ll');
  }
}

function kmFormatter(cell) {
  if (cell) {
    return `${cell.toLocaleString()} KM`;
  }
}

function unitNumFormatter(cell) {
  return <strong>{cell}</strong>;
}


const	aPM = { column: 'a_pm_date', title: 'A PM', dataFormat: dateFormatter };

const	bPMDate = { column: 'b_pm_date', title: 'B PM', dataFormat: dateFormatter };

const	bPMDistance = { column: 'b_pm_km_until_next', title: 'B PM (KM)', dataFormat: kmFormatter };

const	tPM = { column: 't_pm_date', title: 'T PM', dataFormat: dateFormatter };

const	oneYear = { column: 'one_year_date', title: 'B-620 (VK)', dataFormat: dateFormatter };

const	fiveYear = { column: 'five_year_date', title: 'B-620 (IP / UC)', dataFormat: dateFormatter };

const	safety = { column: 'safety_date', title: 'Safety', dataFormat: dateFormatter };


export const columnsByUnitType = {
  truck: [aPM, bPMDate, oneYear, fiveYear, safety],
  tractor: [aPM, bPMDistance, safety],
  trailer: [tPM, oneYear, fiveYear, safety]
};


class UnitGrid extends Component {
  static propTypes = {
    units: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    selectedUnitType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { dispatch, selectedUnitType } = this.props;
    dispatch(fetchUnitsIfNeeded(selectedUnitType));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedUnitType !== this.props.selectedUnitType) {
      const { dispatch, selectedUnitType } = nextProps;
      dispatch(fetchUnitsIfNeeded(selectedUnitType));
    }
  }

  pickerOnSelect = eventKey => {
    const { dispatch } = this.props;
    dispatch(push(`/units/${UNIT_TYPES[eventKey]}`));
  }

  render() {
    const { selectedUnitType, units } = this.props;

    return (
      <div>
        <Row>
          <Col>
            <UnitTypePicker
              activeKey={UNIT_TYPES.indexOf(selectedUnitType)}
              onSelect={this.pickerOnSelect}
              options={UNIT_TYPES}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable data={units}>
              <TableHeaderColumn
                dataField="unit_num" isKey dataAlign="center" dataFormat={unitNumFormatter}
              >
                Unit #
              </TableHeaderColumn>

              {columnsByUnitType[selectedUnitType].map(({ column, title, dataFormat }, i) =>
                <TableHeaderColumn key={i} dataField={column} dataSort dataFormat={dataFormat}>
                  {title}
                </TableHeaderColumn>)
              }
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const selectedUnitType = ownProps.params.unitType;
  const { unitsByType } = state;

  const { isFetching, lastUpdated, units } =
    unitsByType[selectedUnitType] || { isFetching: true, units: [] };

  return {
    units,
    isFetching,
    lastUpdated,
    selectedUnitType
  };
}

export default withRouter(connect(mapStateToProps)(UnitGrid));
