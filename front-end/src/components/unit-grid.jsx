import React, {PropTypes} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function dataFormatter(isDate) {
	if (isDate) {
		return (cell, row) => new Date(cell).toLocaleDateString();
	} else {
		return (cell, row) => cell;
	}
}


const UnitGrid = ({units, columns}) => {
	return (
		<BootstrapTable data={units}>
			<TableHeaderColumn dataField="unit_num" isKey={true} dataAlign="center" width="50">
				Unit #
			</TableHeaderColumn>

			{columns.map(({column, title, isDate}, i) =>
				<TableHeaderColumn key={i} dataField={column} dataSort={true} width="175"
													 dataFormat={dataFormatter(isDate)}>
					{title}
				</TableHeaderColumn>)
			}
		</BootstrapTable>
	);
};

UnitGrid.propTypes = {
	units: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
	columns: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default UnitGrid;
