import { MESSAGES } from '../actions';


export default function defaultIntervals(state = {
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
