import 'babel-polyfill';

import createLogger    from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import React           from 'react';
import ReactDOM        from 'react-dom';
import {Provider}      from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import rootReducer from './reducers';
import App         from './components/app';
import {selectUnitType, fetchUnitsIfNeeded} from './actions';

require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
// ----------------------------------------------------------------------------


const loggerMiddleware = createLogger();

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
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
