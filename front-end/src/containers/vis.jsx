import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { requestAllUnits, requestDefaultIntervals } from '../actions';
import { getMonthBreakdown } from '../selectors';
import { MonthChart, MonthList } from '../components/';


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

  // Given an event, returns a click handler fn which will route to the units detailed page.
  createItemClickHandler = ({ unitType, unitID }) => () => {
    this.props.dispatch(push(`/units/${unitType}/${unitID}`));
  }

  render() {
    const { monthBreakdown } = this.props;

    const lists = monthBreakdown.map(({ month, events }) =>
      <MonthList month={month} events={events} itemClickHandler={this.createItemClickHandler} />
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
