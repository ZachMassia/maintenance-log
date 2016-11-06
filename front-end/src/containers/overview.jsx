import React, { PropTypes, Component } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import { fetchUnitsIfNeeded } from '../actions';
import { MONTHS, UNIT_TYPES } from '../constants';

BigCalendar.momentLocalizer(moment)

// Test data
const events = [
  moment(),
  moment().add(2, 'days')
];


class Overview extends Component {
  static propTypes = {
    unitsByType: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    UNIT_TYPES.map(unitType => this.props.dispatch(fetchUnitsIfNeeded(unitType)));
  }

  render() {
    return (
      <div>
        <BigCalendar events={events} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { unitsByType } = state;

  return {
    unitsByType,
    sortBy
  };
}

export default withRouter(connect(mapStateToProps)(Overview));
