import DataGrid from 'react-datagrid';
import React, {Component, PropTypes} from 'react';
import {ListGroup, ListGroupItem, Grid, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';

import Header from '../components/header';
import UnitGrid from '../components/unit-grid';
import UnitTypePicker from '../components/unit-type-picker';
import {
	selectUnitType, fetchUnitsIfNeeded, invalidateUnitType
} from '../actions';

class App extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		const {dispatch, selectedUnitType} = this.props;
		dispatch(fetchUnitsIfNeeded(selectedUnitType));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedUnitType !== this.props.selectUnitType) {
			const {dispatch, selectedUnitType} = nextProps;
			dispatch(fetchUnitsIfNeeded(selectedUnitType));
		}
	}

	handleChange(newUnitType) {
		this.props.dispatch(selectUnitType(newUnitType));
	}

	render() {
		const {selectedUnitType, units, isFetching, lastUpdated} = this.props;

		return (
			<div>
				<Header />
				<Grid>
					<Row>
						<Col md={2}>
							<UnitTypePicker value={selectedUnitType}
															onSelect={this.handleChange}
															options={['Truck', 'Tractor', 'Trailer']} />
						</Col>
						<Col md={10}>
							<UnitGrid units={units} columns={[
								{column: 'safety_date', title: 'Safety Due Date', isDate: true}]} />
						</Col>
					</Row>
				</Grid>
  		</div>
		);
	}
}


App.propTypes = {
	selectedUnitType: PropTypes.string.isRequired,
	units: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	lastUpdated: PropTypes.number,
	dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	const {selectedUnitType, unitsByType} = state;
	const {
		isFetching,
		lastUpdated,
		units
	} = unitsByType[selectedUnitType] || {
		isFetching: true,
		units: []
	}

	return {
		selectedUnitType,
		units,
		isFetching,
		lastUpdated
	}
}

export default connect(mapStateToProps)(App)
