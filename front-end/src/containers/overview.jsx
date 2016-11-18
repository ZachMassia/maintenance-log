import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import BigCalendar from 'react-big-calendar';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import { withRouter } from 'react-router';

import { UNIT_TYPES, DB_DATE_FORMAT } from '../constants';
import { fetchAllUnits } from '../actions';


BigCalendar.momentLocalizer(moment);


class Overview extends Component {
  static propTypes = {
    unitsByType: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const { dispatch, unitsByType } = this.props;
    this.events = [];

    dispatch(fetchAllUnits()).then(() => this.createEvents(unitsByType));
  }

  createEvents() {
    // Which events to grab from each unit type.
    const eventsByUnitType = {
      tractor: ['safety_date'],
      trailer: ['safety_date', 'one_year_date', 'five_year_date'],
      truck: ['safety_date', 'one_year_date', 'five_year_date']
    };

    // How to display the event type in the calendar itself.
    const eventDisplayStrings = {
      safety_date: 'Safety',
      one_year_date: 'VK',
      five_year_date: 'IP UC'
    };

    for (const unitType of UNIT_TYPES) {
      for (const eventType of eventsByUnitType[unitType]) {
        // Save the event display string to avoid multiple lookups.
        const eventStr = eventDisplayStrings[eventType];

        // Push all events for a given unitType -> eventType pair into the events array.
        this.events.push(...this.props.unitsByType[unitType].units.map(unit => {
          let eventDate = null;

          if (eventType === 'safety_date') {
            // A safety is due on the last day of the month it was done.
            const safetyDate = moment(unit[eventType], DB_DATE_FORMAT);
            eventDate = moment(safetyDate).endOf('month');
          } else {
            eventDate = unit[eventType];
          }

          return {
            title: `${unit.unit_num} - ${eventStr}`,
            allDay: true,
            start: eventDate,
            end: eventDate,
            unitID: unit.id,
            unitType
          };
        }));
      }
    }
  }

  render() {
    return (
      <Row>
        <Col>
          <BigCalendar
            timeslots={4}
            events={this.events}
            style={{ minHeight: '550px' }}
            popup
            onSelectEvent={({ unitID, unitType}) => this.props.dispatch(push(`/units/${unitType}/${unitID}`))}
          />
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  const { unitsByType } = state;

  return {
    unitsByType,
  };
}

export default withRouter(connect(mapStateToProps)(Overview));
