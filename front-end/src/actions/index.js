import fetch from 'isomorphic-fetch';

export const SELECT_UNIT_TYPE     = 'SELECT_UNIT_TYPE';
export const INVALIDATE_UNIT_TYPE = 'INVALIDATE_UNIT_TYPE';
export const REQUEST_UNITS        = 'REQUEST_UNITS';
export const RECEIVE_UNITS        = 'RECEIVE_UNITS';


export function selectUnitType(unitType) {
	return {
		type: SELECT_UNIT_TYPE,
		unitType
	};
}

export function invalidateUnitType(unitType) {
	return {
		type: INVALIDATE_UNIT_TYPE,
		unitType
	}
}

function requestUnits(unitType) {
	return {
		type: REQUEST_UNITS,
		unitType
	}
}

function receiveUnits(unitType, json) {
	return {
		type: RECEIVE_UNITS,
		unitType,
		units: json.objects,
		receivedAt: Date.now()
	}
}

function fetchUnits(unitType) {
	return function (dispatch) {
		// First dispatch: The app state is updated to inform
		//                 that the API call is starting.
		dispatch(requestUnits(unitType));

		// TODO: Error handling.
		// The following fetch call assumes that both the front and back end servers are at the same IP.
		return fetch(`http://${window.location.hostname}:5000/api/${unitType}`)
			.then(response => response.json())
			.then(json => dispatch(receiveUnits(unitType, json)));
	}
}

function shouldFetchUnits(state, unitType) {
	const units = state.unitsByType[unitType];
	if (!units) {
		return true;
	} else if (units.isFetching) {
		return false;
	} else {
		return units.didInvalidate;
	}
}

export function fetchUnitsIfNeeded(unitType) {
	// Note that the function also receives getState()
	// which lets you choose what to dispatch next.
	//
	// This is useful for avoiding a network request if
	// a cached value is already available.

	return (dispatch, getState) => {
		if (shouldFetchUnits(getState(), unitType)) {
			return dispatch(fetchUnits(unitType));
		} else {
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	}
}
