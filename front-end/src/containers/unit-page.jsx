import { Col, Row } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router';

import { UNIT_TYPES } from '../constants';


class UnitPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    unitType: PropTypes.string.isRequired,
    unitID: PropTypes.string.isRequired
  }

  render() {
    const { unitType, unitID } = this.props;

    return (
      <Row>
        <Col>
          <p>{unitType} {unitID}</p>
        </Col>
      </Row>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const unitType = ownProps.params.unitType;
  const unitID = ownProps.params.unitID;

  return {unitType, unitID};
}


export default withRouter(connect(mapStateToProps)(UnitPage));
