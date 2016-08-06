import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import { INVALIDATE_UNIT_TYPE, REQUEST_UNITS, RECEIVE_UNITS } from '../actions';


function units(state = {
  isFetching: false,
  didInvalidate: false,
  units: []
}, action) {
  switch (action.type) {
    case INVALIDATE_UNIT_TYPE:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_UNITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_UNITS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        units: action.units,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function unitsByType(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_UNIT_TYPE:
    case RECEIVE_UNITS:
    case REQUEST_UNITS:
      return Object.assign({}, state, {
        [action.unitType]: units(state[action.unitType], action)
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  unitsByType,
  routing
});

export default rootReducer;
