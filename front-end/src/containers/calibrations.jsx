import React, { PropTypes, Component } from 'react';
import {
  Grid, Col, Row, Table, Checkbox, Button, ButtonGroup, ListGroup, ListGroupItem
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { taffy } from 'taffydb';

import { requestUnits, requestDefaultIntervals } from '../actions';
import { DB_DATE_FORMAT } from '../constants';

const moment = extendMoment(Moment);


function dateCompNearestFirst(a, b) {
  const today = moment();
  const aRange = moment.range(a.date, today);
  const bRange = moment.range(b.date, today);

  if (aRange > bRange) return -1;
  if (aRange < bRange) return 1;
  return 0;
}

class Calibrations extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    trucks: PropTypes.func.isRequired,
    defaultIntervals: PropTypes.func.isRequired,
    isFetchingTrucks: PropTypes.bool.isRequired,  // eslint-disable-line
    isFetchingDefIntervals: PropTypes.bool.isRequired // eslint-disable-line
  }

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    dispatch(requestDefaultIntervals());
    dispatch(requestUnits('truck'));

    this.state = {
      range: 3,
      includePropane: false
    };
  }

  getFirstCalDue = (unit) => {
    const { id, unit_num, propane_cal_date, oil_cal_date, gas_cal_date } = unit;
    const { defaultIntervals } = this.props;

    // Convert the last done dates to momentjs objects.
    // TODO: Convert all dates to momentjs as soon as they're received in the reducer.
    //       This will do for now, but is quite verbose for nothing.
    const propane = moment(propane_cal_date, DB_DATE_FORMAT);
    const oil = moment(oil_cal_date, DB_DATE_FORMAT);
    const gas = moment(gas_cal_date, DB_DATE_FORMAT);

    if (propane.isValid()) {
      const propane_int = defaultIntervals({ service_type: 'propane_cal' }).first().interval;
      return { id, unit_num, type: 'Propane', date: propane.add(propane_int, 'days') };
    }

    const oil_int = defaultIntervals({ service_type: 'oil_cal' }).first().interval;
    const gas_int = defaultIntervals({ service_type: 'gas_cal' }).first().interval;

    if (oil.isBefore(gas, 'days')) {
      return { id, unit_num, type: 'Oil/Gas', date: oil.add(oil_int, 'days') };
    }

    if (gas.isBefore(oil, 'days')) {
      return { id, unit_num, type: 'Oil/Gas', date: gas.add(gas_int, 'days') };
    }

    if (gas.isSame(oil, 'days')) {
      return { id, unit_num, type: 'Oil/Gas', date: gas.add(gas_int, 'days') };
    }

    return { id, unit_num, type: 'N/A', date: null };
  }

  getB620Due = (unitID) => {
    const { trucks, defaultIntervals } = this.props;
    const unit = trucks({ id: unitID }).first();

    const oneYearInt = defaultIntervals({
      unit_type: 'truck', service_type: 'one_year'
    }).first().interval;

    const lastDone = moment(unit.one_year_date, DB_DATE_FORMAT);
    return lastDone.add(oneYearInt, 'days');
  }

  dateInRangePred = ({ date }) => {
    if (date && date.isValid()) {
      return date.isBefore(moment().add(this.state.range, 'months'));
    }
    return false;
  }

  includePropanePred = ({ type }) => {
    if (this.state.includePropane) {
      return true; // Includes everything essentially.
    }
    return !(type === 'Propane');
  }

  unitFilter = unit => this.includePropanePred(unit) && this.dateInRangePred(unit);

  createMonthSelectBtn = n => (
    <Button
      key={`mBtn${n}`}
      active={this.state.range === n}
      onClick={() => this.setState({ range: n })}
    >
      {n} Months
    </Button>
  )

  createClickHandler = id => () => this.props.dispatch(push(`/units/truck/${id}`));

  render() {
    const { trucks } = this.props;

    const sortedByCal = trucks()
      .map(this.getFirstCalDue)
      .filter(this.unitFilter)
      .sort(dateCompNearestFirst);

    const trucksMissingCal = trucks({
      oil_cal_date: null, gas_cal_date: null, propane_cal_date: null
    });

    return (
      <Grid>
        <Row>
          <Col md={8}><h2>Upcoming calibrations</h2></Col>
          <Col md={4}>
            <ButtonGroup>
              {[3, 6, 12].map(this.createMonthSelectBtn)}
            </ButtonGroup>
            <Checkbox
              checked={this.state.includePropane}
              onClick={() => this.setState({ includePropane: !this.state.includePropane })}
            >
              Include Propane
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Calibration Due</th>
                  <th>B620 Due</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {sortedByCal.map(t =>
                  <tr key={t.id} onClick={this.createClickHandler(t.id)}>
                    <td>{t.unit_num}</td>
                    <td>
                      {
                        t.date && t.date.isValid() ? (
                          t.date.format('ll')
                        ) : (
                          ''
                        )
                      }
                    </td>
                    <td>{this.getB620Due(t.id).format('ll')}</td>
                    <td>{t.type}</td>
                  </tr>)
                }
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col><h2>Trucks Missing Calibration Data</h2></Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {trucksMissingCal.map(t =>
                <ListGroupItem key={t.id} onClick={this.createClickHandler(t.id)}>
                  {t.unit_num}
                </ListGroupItem>)}
            </ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const { unitsByType, defaultIntervals } = state;

  const trucks = unitsByType.truck || { isFetching: true, units: [] };
  const intervals = defaultIntervals || { isFetching: true, intervals: [] };

  return {
    trucks: taffy(trucks.units),
    isFetchingTrucks: trucks.isFetching,
    defaultIntervals: taffy(intervals.intervals),
    isFetchingDefIntervals: intervals.isFetching
  };
}

export default withRouter(connect(mapStateToProps)(Calibrations));
