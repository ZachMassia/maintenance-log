import DataGrid from 'react-datagrid';
import React from 'react';
import {connect} from 'react-redux';

function mapStateToPropsForUnit (unitType) {
	// Return a mapStateToProps function for a given unit type.
	return (state) => {
		return {
			units: state.units[unitType]
		}
	}
}

export default function UnitList (unitType) {
	return connect(
		mapStateToPropsForUnit(unitType)
	)(DataGrid);
}
