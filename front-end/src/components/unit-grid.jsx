import React, {PropTypes} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function dateFormatter(cell, row) {
	return new Date(cell).toLocaleDateString();
}

function kmFormatter(cell, row) {
	return `${cell.toLocaleString()} KM`;
}

const	bPM      = (formatter) => ({column: "b_pm_date",      title: "B PM", dataFormat: formatter});

const	aPM      = {column: "a_pm_date",      title: "A PM",            dataFormat: dateFormatter};
const	tPM      = {column: "t_pm_date",      title: "T PM",            dataFormat: dateFormatter};
const	oneYear  = {column: "one_year_date",  title: "B-620 (VK)",      dataFormat: dateFormatter};
const	fiveYear = {column: "five_year_date", title: "B-620 (IP / UC)", dataFormat: dateFormatter};
const	safety   = {column: "safety_date", 		title: "Safety",          dataFormat: dateFormatter};


const columnsByUnitType = {
	truck:   [aPM, bPM(dateFormatter), oneYear, fiveYear, safety],
	tractor: [aPM, bPM(kmFormatter), safety],
	trailer: [tPM, oneYear, fiveYear, safety]
};


const UnitGrid = ({units, selectedUnitType}) => {
	return (
		<BootstrapTable data={units}>
			<TableHeaderColumn dataField="unit_num" isKey={true} dataAlign="center">
				Unit #
			</TableHeaderColumn>

			{columnsByUnitType[selectedUnitType].map(({column, title, dataFormat}, i) =>
				<TableHeaderColumn key={i} dataField={column} dataSort={true}
													 dataFormat={dataFormat}>
					{title}
				</TableHeaderColumn>)
			}
		</BootstrapTable>
	);
};

UnitGrid.propTypes = {
	units: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
	selectedUnitType: PropTypes.string.isRequired
};

export default UnitGrid;