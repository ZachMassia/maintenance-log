import keyMirror from 'key-mirror';

export const UNIT_MESSAGES = keyMirror({
  INVALIDATE_UNIT_TYPE: null,
  REQUEST_UNITS: null,
  REQUEST_ALL_UNITS: null,
  RECEIVE_UNITS: null,
});


export function invalidateUnitType(unitType) {
  return {
    type: UNIT_MESSAGES.INVALIDATE_UNIT_TYPE,
    unitType
  };
}

export function requestUnits(unitType) {
  return {
    type: UNIT_MESSAGES.REQUEST_UNITS,
    unitType
  };
}

export function requestAllUnits() {
  return {
    type: UNIT_MESSAGES.REQUEST_ALL_UNITS
  };
}

export function receiveUnits(unitType, json) {
  return {
    type: UNIT_MESSAGES.RECEIVE_UNITS,
    unitType,
    units: json.objects,
    receivedAt: Date.now()
  };
}
