import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';
import Root from './containers/Root';

render(
	<Root />,
	document.querySelector('#myApp')
);


/* // Test API
store.dispatch(selectUnitType('trailer'));
store.dispatch(fetchUnitsIfNeeded('trailer')).then(() =>
	console.log(store.getState())
);
// */

/*
	Basic "shape" of store data.

	{
		selectedUnitType: 'truck',
		unitsByType {
			tractor: {
				isFetching: false,
				didInvalidate: false,
				units: [
					{
						id: 1,
						unit_num: 109,
						...
					}
				]
			},
			trailer: {
				...
			},
			truck: {
				...
			}
		}
	}
*/
