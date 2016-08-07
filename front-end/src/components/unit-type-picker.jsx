import React, { PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';


String.prototype.capitalize = function () { // eslint-disable-line
  return this.charAt(0).toUpperCase() + this.slice(1);
};


const UnitTypePicker = ({ activeKey, onSelect, options }) =>
  <Nav bsStyle="pills" activeKey={activeKey} onSelect={onSelect}>
    {options.map((option, i) =>
      <NavItem eventKey={i} key={i}>{option.capitalize()}</NavItem>)}
  </Nav>;

UnitTypePicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  activeKey: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default UnitTypePicker;
