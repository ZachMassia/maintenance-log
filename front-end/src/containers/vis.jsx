import React, { PropTypes, Component } from 'react';
import { Col, Row, Badge, ListGroup, ListGroupItem, Label } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

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

  createListItem = (event) => {
    const itemKey = `${event.unitID}-${event.eventType})`;

    const titleParts = event.title.split(' - ');
    const unitNum = titleParts[0];
    const evDispStr = titleParts[1];

    const clickHandler = () => {
      this.props.dispatch(push(`/units/${event.unitType}/${event.unitID}`));
    };

    return (
      <ListGroupItem key={itemKey} onClick={clickHandler}>
        {unitNum} <Label bsStyle="primary">{evDispStr}</Label>
      </ListGroupItem>
    );
  }

  render() {
    const { monthBreakdown } = this.props;

    const lists = monthBreakdown.map(monthData =>
      <Col lg={3} key={`col-${monthData.month}`}>
        <h3>{monthData.month} <Badge>{monthData.events.length}</Badge></h3>
        <ListGroup>
          {monthData.events.map(this.createListItem)}
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
