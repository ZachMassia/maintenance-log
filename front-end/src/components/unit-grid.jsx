import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

function dateFormatter(cell) {
  if (cell !== null) {
    return new Date(cell).toLocaleDateString();
  }
}

function kmFormatter(cell) {
  return `${cell.toLocaleString()} KM`;
}


const	aPM = { column: 'a_pm_date', title: 'A PM', dataFormat: dateFormatter };

const	bPMDate = { column: 'b_pm_date', title: 'B PM', dataFormat: dateFormatter };

const	bPMDistance = { column: 'b_pm_km_until_next', title: 'B PM (KM)', dataFormat: kmFormatter };

const	tPM = { column: 't_pm_date', title: 'T PM', dataFormat: dateFormatter };

const	oneYear = { column: 'one_year_date', title: 'B-620 (VK)', dataFormat: dateFormatter };

const	fiveYear = { column: 'five_year_date', title: 'B-620 (IP / UC)', dataFormat: dateFormatter };

const	safety = { column: 'safety_date', title: 'Safety', dataFormat: dateFormatter };


const columnsByUnitType = {
  truck: [aPM, bPMDate, oneYear, fiveYear, safety],
  tractor: [aPM, bPMDistance, safety],
  trailer: [tPM, oneYear, fiveYear, safety]
};


// const UnitGrid = ({units, selectedUnitType}) => {
class UnitGrid extends Component {
  static propTypes = {
    units: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    selectedUnitType: PropTypes.string.isRequired
  }

  render() {
    const { selectedUnitType, units } = this.props;

    return (
      <BootstrapTable data={units}>
        <TableHeaderColumn dataField="unit_num" isKey dataAlign="center">
          Unit #
        </TableHeaderColumn>

        {columnsByUnitType[selectedUnitType].map(({ column, title, dataFormat }, i) =>
          <TableHeaderColumn key={i} dataField={column} dataSort dataFormat={dataFormat}>
            {title}
          </TableHeaderColumn>)
        }
      </BootstrapTable>
    );
  }
}


function mapStateToProps(state, ownProps) {
  const selectedUnitType = ownProps.params.unitType;

  return {
    selectedUnitType,
    units: state.unitsByType[selectedUnitType].units || [{}]
  };
}

export default withRouter(connect(mapStateToProps)(UnitGrid));
