import React, { Component, PropTypes } from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import Header from '../components/header';
import UnitTypePicker from '../components/unit-type-picker';
import { fetchUnitsIfNeeded } from '../actions';


const UnitTypes = ['truck', 'tractor', 'trailer'];


class App extends Component {

  static propTypes = {
    selectedUnitType: PropTypes.string.isRequired,
    units: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
    const { dispatch, selectedUnitType } = this.props;
    dispatch(fetchUnitsIfNeeded(selectedUnitType));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedUnitType !== this.props.selectedUnitType) {
      const { dispatch, selectedUnitType } = nextProps;
      dispatch(fetchUnitsIfNeeded(selectedUnitType));
    }
  }

  handleChange = eventKey => {
    // this.props.dispatch(selectUnitType(UnitTypes[eventKey]));
    const { dispatch } = this.props;

    dispatch(push(`/units/${UnitTypes[eventKey]}`));
  }

  render() {
    const { selectedUnitType } = this.props;

    return (
      <div>
        <Header />
        <Grid>
          <Row>
            <Col xs={12}>
              <UnitTypePicker
                activeKey={UnitTypes.indexOf(selectedUnitType)}
                onSelect={this.handleChange}
                options={UnitTypes}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const { unitsByType } = state;
  const selectedUnitType = ownProps.params.unitType;
  const {
    isFetching,
    lastUpdated,
    units
  } = unitsByType[selectedUnitType] || {
    isFetching: true,
    units: []
  };

  return {
    selectedUnitType,
    units,
    isFetching,
    lastUpdated
  };
}

export default withRouter(connect(mapStateToProps)(App));
