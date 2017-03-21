import React, { PropTypes, Component } from 'react';
import { Col, Row, Badge, ListGroup, ListGroupItem, Label } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { requestAllUnits, requestDefaultIntervals } from '../actions';
import { getMonthBreakdown } from '../selectors';
import MonthChart from '../components/monthchart';


class Vis extends Component {
  static propTypes = {
    monthBreakdown: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static formatListItem(event) {
    const itemKey = `${event.unitID}-${event.eventType})`;

    const titleParts = event.title.split(' - ');
    const unitNum = titleParts[0];
    const evDispStr = titleParts[1];

    return (
      <ListGroupItem key={itemKey}>
        {unitNum} <Label bsStyle="primary">{evDispStr}</Label>
      </ListGroupItem>
    );
  }

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    dispatch(requestAllUnits());
    dispatch(requestDefaultIntervals());
  }

  render() {
    const { monthBreakdown } = this.props;

    const lists = monthBreakdown.map(monthData =>
      <Col lg={3} key={`col-${monthData.month}`}>
        <h3>{monthData.month} <Badge>{monthData.events.length}</Badge></h3>
        <ListGroup>
          {monthData.events.map(Vis.formatListItem)}
        </ListGroup>
      </Col>
    );

    return (
      <div>
        <Row>
          <Col><MonthChart data={monthBreakdown} /></Col>
        </Row>
        <Row>{lists.slice(0, 4)}</Row>
        <Row>{lists.slice(4, 8)}</Row>
        <Row>{lists.slice(8)}</Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    monthBreakdown: getMonthBreakdown(state)
  };
}

export default withRouter(connect(mapStateToProps)(Vis));
