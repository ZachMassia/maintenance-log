import keyMirror from 'key-mirror';

export const MESSAGES = keyMirror({
  INVALIDATE_UNIT_TYPE: null,
  REQUEST_UNITS: null,
  REQUEST_ALL_UNITS: null,
  RECEIVE_UNITS: null,
  INVALIDATE_DEFAULT_INTERVALS: null,
  REQUEST_DEFAULT_INTERVALS: null,
  RECEIVE_DEFAULT_INTERVALS: null
});


export function invalidateUnitType(unitType) {
  return {
    type: MESSAGES.INVALIDATE_UNIT_TYPE,
    unitType
  };
}

export function requestUnits(unitType) {
  return {
    type: MESSAGES.REQUEST_UNITS,
    unitType
  };
}

export function requestAllUnits() {
  return {
    type: MESSAGES.REQUEST_ALL_UNITS
  };
}

export function receiveUnits(unitType, json) {
  return {
    type: MESSAGES.RECEIVE_UNITS,
    unitType,
    units: json.objects,
    receivedAt: Date.now()
  };
}

export function invalidateDefaultIntervals() {
  return {
    type: MESSAGES.INVALIDATE_DEFAULT_INTERVALS
  };
}

export function requestDefaultIntervals() {
  return {
    type: MESSAGES.REQUEST_DEFAULT_INTERVALS
  };
}

export function receiveDefaultIntervals(json) {
  return {
    type: MESSAGES.RECEIVE_DEFAULT_INTERVALS,
    intervals: json.objects,
    receivedAt: Date.now()
  };
}
