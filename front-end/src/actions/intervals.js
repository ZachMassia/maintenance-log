import keyMirror from 'key-mirror';

export const INTERVAL_MESSAGES = keyMirror({
  INVALIDATE_DEFAULT_INTERVALS: null,
  REQUEST_DEFAULT_INTERVALS: null,
  RECEIVE_DEFAULT_INTERVALS: null
});


export function invalidateDefaultIntervals() {
  return {
    type: INTERVAL_MESSAGES.INVALIDATE_DEFAULT_INTERVALS
  };
}

export function requestDefaultIntervals() {
  return {
    type: INTERVAL_MESSAGES.REQUEST_DEFAULT_INTERVALS
  };
}

export function receiveDefaultIntervals(json) {
  return {
    type: INTERVAL_MESSAGES.RECEIVE_DEFAULT_INTERVALS,
    intervals: json.objects,
    receivedAt: Date.now()
  };
}
