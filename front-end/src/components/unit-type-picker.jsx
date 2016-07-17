import React, {Component, PropTypes} from 'react';
import {SplitButton, MenuItem} from 'react-bootstrap';

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

export default class UnitTypePicker extends Component {
	render() {
		const {value, onChange, options} = this.props;

		return (
			<SplitButton bsStyle="primary" title={value.capitalize()} id="UnitTypePicker-Dropdown"
									 onSelect={(eventKey, event) => onChange(options[eventKey].toLowerCase())}>
				{options.map((option, i) =>
					<MenuItem eventKey={i} key={i}>{option.capitalize()}</MenuItem>
				)}
			</SplitButton>
		)
	}
}

UnitTypePicker.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}
