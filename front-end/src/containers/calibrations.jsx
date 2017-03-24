import React, { PropTypes, Component } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
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
    isFetching: PropTypes.bool.isRequired,  // eslint-disable-line react/no-unused-prop-types
  }

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    dispatch(requestUnits('truck'));
    dispatch(requestDefaultIntervals());
  }

  render() {
    const { trucks } = this.props;
    const sortedByCal = trucks().map(getFirstCalDue).sort((a, b) => {
      const today = moment();
      const aRange = moment.range(a.date, today);
      const bRange = moment.range(b.date, today);

      if (aRange > bRange) return -1;
      if (aRange < bRange) return 1;
      return 0;
    });

    return (
      <Col>
        <Row><h2>Upcoming calibrations</h2></Row>
        <Row>
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
        </Row>
      </Col>
    );
  }
}

function mapStateToProps(state) {
  const { unitsByType } = state;

  const { isFetching, units } = unitsByType.truck || { isFetching: true, units: [] };

  return {
    trucks: taffy(units),
    isFetching
  };
}

export default withRouter(connect(mapStateToProps)(Calibrations));
