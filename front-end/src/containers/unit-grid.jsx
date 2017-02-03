import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';

import { DB_DATE_FORMAT } from '../constants';
import { requestUnits } from '../actions';


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


const aPM = {
  column: 'a_pm_date', title: 'A PM', dataFormat: dateFormatter
};

const bPMDate = {
  column: 'b_pm_date', title: 'B PM', dataFormat: dateFormatter
};

const bPMDistance = {
  column: 'b_pm_km_until_next', title: 'B PM (KM Left)', dataFormat: kmFormatter
};

const tPM = {
  column: 't_pm_date', title: 'T PM', dataFormat: dateFormatter
};

const oneYear = {
  column: 'one_year_date', title: 'One Year B-620', dataFormat: dateFormatter
};

const fiveYear = {
  column: 'five_year_date', title: 'Five Year B-620', dataFormat: dateFormatter
};

const safety = {
  column: 'safety_date', title: 'Safety', dataFormat: dateFormatter
};


export const columnsByUnitType = {
  truck: [aPM, bPMDate, oneYear, fiveYear, safety],
  tractor: [aPM, bPMDistance, safety],
  trailer: [tPM, oneYear, fiveYear, safety]
};


class UnitGrid extends Component {
  static propTypes = {
    units: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,  // eslint-disable-line react/no-unused-prop-types
    lastUpdated: PropTypes.object,  // eslint-disable-line react/no-unused-prop-types
    selectedUnitType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { dispatch, selectedUnitType } = this.props;
    dispatch(requestUnits(selectedUnitType));
    this.state = {
      searchTerm: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedUnitType !== this.props.selectedUnitType) {
      const { dispatch, selectedUnitType } = nextProps;
      dispatch(requestUnits(selectedUnitType));
    }
  }

  render() {
    const { selectedUnitType, units } = this.props;

    const options = {
      onRowClick: ({ id }) => {
        this.props.dispatch(push(`/units/${selectedUnitType}/${id}`));
      }
    };

    return (
      <div>
        <Row>
          <Col>
            <BootstrapTable data={units} options={options}>
              <TableHeaderColumn
                isKey dataField="unit_num" dataAlign="center" dataFormat={unitNumFormatter}
                filter={{ type: 'TextFilter', delay: 200 }}
              >
                Unit #
              </TableHeaderColumn>

              {columnsByUnitType[selectedUnitType].map(({ column, title, dataFormat }) =>
                <TableHeaderColumn key={title} dataField={column} dataSort dataFormat={dataFormat}>
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
