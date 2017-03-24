import React, { PropTypes, Component } from 'react';
import { Grid, Col, Row, Table, Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { taffy } from 'taffydb';

import { requestUnits, requestDefaultIntervals } from '../actions';
import { DB_DATE_FORMAT } from '../constants';

const moment = extendMoment(Moment);


function getFirstCalDue({ id, unit_num, propane_cal_date, oil_cal_date, gas_cal_date }) {
  const propane = moment(propane_cal_date, DB_DATE_FORMAT);
  const oil = moment(oil_cal_date, DB_DATE_FORMAT);
  const gas = moment(gas_cal_date, DB_DATE_FORMAT);

  if (propane.isValid()) {
    return { id, unit_num, type: 'Propane', date: propane };
  }

  if (oil.isBefore(gas, 'days')) {
    return { id, unit_num, type: 'Oil/Gas', date: oil };
  }

  if (gas.isBefore(oil, 'days')) {
    return { id, unit_num, type: 'Oil/Gas', date: gas };
  }

  if (gas.isSame(oil, 'days')) {
    return { id, unit_num, type: 'Oil/Gas', date: gas };
  }

  return { id, unit_num, type: 'N/A', date: null };
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
      range: 3
    };
  }

  createMonthSelectBtn = n => (
    <Button
      key={`mBtn${n}`}
      active={this.state.range === n}
      onClick={() => this.setState({ range: n })}
    >
      {n} Months
    </Button>
  )

  render() {
    const { trucks, defaultIntervals } = this.props;
    const sortedByCal = trucks().map(getFirstCalDue)
      .sort((a, b) => {
        const today = moment();
        const aRange = moment.range(a.date, today);
        const bRange = moment.range(b.date, today);

        if (aRange > bRange) return -1;
        if (aRange < bRange) return 1;
        return 0;
      });
      //.filter(t => t.date.isBefore(moment().add(6, 'months')));

    return (
      <Grid>
        <Row>
          <Col md={8}><h2>Upcoming calibrations</h2></Col>
          <Col md={4}>
            <ButtonGroup>
              {[3, 6, 12].map(this.createMonthSelectBtn)}
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered condensed>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {sortedByCal.map(t =>
                  <tr key={t.id}>
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
                    <td>{t.type}</td>
                  </tr>)}
              </tbody>
            </Table>
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
    defaultIntervals: taffy(intervals),
    isFetchingDefIntervals: intervals.isFetching
  };
}

export default withRouter(connect(mapStateToProps)(Calibrations));
