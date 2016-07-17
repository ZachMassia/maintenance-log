import DataGrid from 'react-datagrid';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import UnitList from '../components/unit-list';
import {
	selectUnitType, fetchUnitsIfNeeded, invalidateUnitType
} from '../actions';

class App extends Component {
	constructor(props) {
		super(props);
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

	render() {
		const {selectedUnitType, units, isFetching, lastUpdated} = this.props;

		return <p>Testing</p>
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
