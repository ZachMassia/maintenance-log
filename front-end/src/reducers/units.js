import { MESSAGES } from '../actions';


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

export default function unitsByType(state = {}, action) {
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
