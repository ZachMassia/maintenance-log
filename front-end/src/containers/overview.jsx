import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import BigCalendar from 'react-big-calendar';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import { withRouter } from 'react-router';

import { requestAllUnits, requestDefaultIntervals } from '../actions';
import { getEvents } from '../selectors';


BigCalendar.momentLocalizer(moment);


class Overview extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(requestDefaultIntervals());
    dispatch(requestAllUnits());
  }

  render() {
    return (
      <Row>
        <Col>
          <BigCalendar
            timeslots={4}
            events={this.props.events}
            style={{ minHeight: '550px' }}
            popup
            onSelectEvent={
              ({ unitID, unitType }) => this.props.dispatch(push(`/units/${unitType}/${unitID}`))
            }
          />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: getEvents(state) || []
  };
}

export default withRouter(connect(mapStateToProps)(Overview));
