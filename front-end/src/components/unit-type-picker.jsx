import React, {Component, PropTypes} from 'react';
import {SplitButton, MenuItem} from 'react-bootstrap';

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

const UnitTypePicker = ({value, onSelect, options}) => {
	return (
		<SplitButton id="UnitTypePicker-Dropdown" bsStyle="primary" title={value.capitalize()}
								 onSelect={(key, e) => onSelect(options[key].toLowerCase())}>
    	{options.map((option, i) =>
				<MenuItem eventKey={i} key={i}>{option.capitalize()}</MenuItem>)}
    </SplitButton>
	)
};

UnitTypePicker.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	value: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default UnitTypePicker;
