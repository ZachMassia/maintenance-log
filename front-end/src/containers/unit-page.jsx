import { Col, Row, Table } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { DB_DATE_FORMAT } from '../constants';
import { fetchUnitsIfNeeded } from '../actions';
import { columnsByUnitType } from './unit-grid';


class UnitPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    unitType: PropTypes.string.isRequired,
    unitID: PropTypes.number.isRequired,  // eslint-disable-line react/no-unused-prop-types
    unit: PropTypes.object.isRequired
  }

  static renderDaysUntilDue(column, data) {
    if (column === 'b_pm_km_until_next') {
      return <td>N/A</td>;
    }
    const date = moment(data, DB_DATE_FORMAT);
    return <td>{date.fromNow()}</td>;
  }

  constructor(props) {
    super(props);
    const { dispatch, unitType } = this.props;

    // TODO: Add single unit loading to speed things up instead of loading all
    //       units of a given type.
    dispatch(fetchUnitsIfNeeded(unitType));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unitType !== this.props.unitType) {
      const { dispatch, unitType } = nextProps;
      dispatch(fetchUnitsIfNeeded(unitType));
    }
  }

  render() {
    const { unit, unitType } = this.props;

    return (
      <Row>
        <Col xs={2}>
          <h2 centered>Unit {unit.unit_num}</h2>
        </Col>
        <Col xs={10}>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Event</th>
                <th>Due Date</th>
                <th># Days Until Due</th>
              </tr>
            </thead>
            <tbody>
              {columnsByUnitType[unitType].map(({ column, title, dataFormat }) =>
                <tr key={title}>
                  <td>{title}</td>
                  <td>{dataFormat(unit[column])}</td>
                  {this.renderDaysUntilDue(column, unit[column])}
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const unitType = ownProps.params.unitType;
  const unitID = parseInt(ownProps.params.unitID, 10);

  // Grab the unit object from the store.
  // The unit ID's are 1-indexed on the Flask side, so offset the array index by 1.
  const { units } = state.unitsByType[unitType] || { units: [] };

  let unit = {};
  if (units.length) {
    unit = units[unitID - 1];
  }

  return {
    unitType,
    unitID,
    unit };
}


export default withRouter(connect(mapStateToProps)(UnitPage));
