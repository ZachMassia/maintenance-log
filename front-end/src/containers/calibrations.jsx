import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { requestUnits, requestDefaultIntervals } from '../actions';


function getFirstCalDue({ id, propane_cal_date, oil_cal_date, gas_cal_date }) {
  if (propane_cal_date) {
    return { id, type: 'propane', date: propane_cal_date };
  }

  if (oil_cal_date.isBefore(gas_cal_date, 'days')) {
    return { id, type: 'oil', date: oil_cal_date };
  }
  return { id, type: 'gas', date: gas_cal_date };
}


class Calibrations extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    trucks: PropTypes.array.isRequired,
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

    return (
      <Col>
        {trucks.map(t => <Row><p>{t.id}</p></Row>)}
      </Col>
    );
  }
}

function mapStateToProps(state) {
  const { unitsByType } = state;

  const { isFetching, units } = unitsByType.truck || { isFetching: true, units: [] };

  return {
    trucks: units,
    isFetching
  };
}

export default withRouter(connect(mapStateToProps)(Calibrations));
