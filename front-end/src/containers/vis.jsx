import React, { PropTypes, Component } from 'react';
import { Col, Row, Badge, ListGroup, ListGroupItem } from 'react-bootstrap';
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

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    dispatch(requestAllUnits());
    dispatch(requestDefaultIntervals());
  }

  render() {
    const { monthBreakdown } = this.props;

    const lists = monthBreakdown.map(monthData =>
      <Col lg={3}>
        <h3>{monthData.month} <Badge>{monthData.events.length}</Badge></h3>
        <ListGroup>
          {monthData.events.map(event =>
            <ListGroupItem>{event.title}</ListGroupItem>
          )}
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
