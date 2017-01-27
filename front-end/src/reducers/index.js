import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import { MESSAGES } from '../actions';


function defaultIntervals(state = {
  isFetching: false,
  didInvalidate: false,
  intervals: {}
}, action) {
  switch (action.type) {
    case MESSAGES.INVALIDATE_DEFAULT_INTERVALS:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case MESSAGES.REQUEST_DEFAULT_INTERVALS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case MESSAGES.RECEIVE_DEFAULT_INTERVALS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        intervals: action.intervals,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function units(state = {
  isFetching: false,
  didInvalidate: false,
  units: []
}, action) {
  switch (action.type) {
    case MESSAGES.INVALIDATE_UNIT_TYPE:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case MESSAGES.REQUEST_UNITS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case MESSAGES.RECEIVE_UNITS:
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
    case MESSAGES.INVALIDATE_UNIT_TYPE:
    case MESSAGES.RECEIVE_UNITS:
    case MESSAGES.REQUEST_UNITS:
      return Object.assign({}, state, {
        [action.unitType]: units(state[action.unitType], action)
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  unitsByType,
  defaultIntervals,
  routing
});

export default rootReducer;
