/* eslint no-constant-condition: off */

import fetch from 'isomorphic-fetch';
import restful, { fetchBackend } from 'restful.js';
import { take, select, put, call, fork } from 'redux-saga/effects';
import moment from 'moment';

import * as actions from '../actions';
import { UNIT_TYPES } from '../constants';


const api = restful(`http://${window.location.hostname}:5000/api`, fetchBackend(fetch));
const CACHE_TIME = 5; // minutes

const unitsSelector = state => state.unitsByType;
const defaultIntervalsSelecter = state => state.defaultIntervals;

function shouldFetchUnits({ units, lastUpdated, didInvalidate }) {
  const now = moment();

  if (!units.length) {
    return true;
  } else if (lastUpdated && moment.duration(now.diff(lastUpdated)).asMinutes() > CACHE_TIME) {
    return true;
  }
  return didInvalidate;
}

function shouldFetchDefaultIntervals({ intervals, lastUpdated, didInvalidate }) {
  const now = moment();

  if (!intervals.length) {
    return true;
  } else if (lastUpdated && moment.duration(now.diff(lastUpdated)).asMinutes() > CACHE_TIME) {
    return true;
  }
  return didInvalidate;
}

// ---- API ---- //
function fetchUnitsApi(unitType, onError) {
  return api.all(unitType).getAll()
    .then(resp => resp.body().data(), onError);
}

function fetchDefaultIntervalsApi(onError) {
  return api.all('default_interval').getAll()
    .then(resp => resp.body().data(), onError);
}

// TODO: Add real error handling.
function placeholderErrorHandler(error) {
  console.log(`An error has occured: ${error}`);  // eslint-disable-line no-console
}


// ---- Sagas ---- //
function* fetchUnits(unitType) {
  const unitsInStore = yield select(unitsSelector);

  if (shouldFetchUnits(unitsInStore[unitType])) {
    const units = yield call(fetchUnitsApi, unitType, placeholderErrorHandler);
    yield put(actions.receiveUnits(unitType, units));
  }
}

function* fetchAllUnits() {
  yield UNIT_TYPES.map(unitType => put(actions.requestUnits(unitType)));
}

function* fetchDefaultIntervals() {
  const defaultIntervalsInStore = yield select(defaultIntervalsSelecter);

  if (shouldFetchDefaultIntervals(defaultIntervalsInStore)) {
    const intervals = yield call(fetchDefaultIntervalsApi, placeholderErrorHandler);
    yield put(actions.receiveDefaultIntervals(intervals));
  }
}


// ---- Watchers ---- //
function* watchFetchUnits() {
  while (true) {
    const { unitType } = yield take(actions.MESSAGES.REQUEST_UNITS);
    yield fork(fetchUnits, unitType);
  }
}

function* watchFetchAllUnits() {
  while (true) {
    yield take(actions.MESSAGES.REQUEST_ALL_UNITS);
    yield fork(fetchAllUnits);
  }
}

function* watchInvalidateUnitType() {
  while (true) {
    const { unitType } = yield take(actions.MESSAGES.INVALIDATE_UNIT_TYPE);
    yield put(actions.requestUnits(unitType));
  }
}

function* watchFetchDefaultIntervals() {
  while (true) {
    yield take(actions.MESSAGES.REQUEST_DEFAULT_INTERVALS);
    yield fork(fetchDefaultIntervals);
  }
}

function* watchInvalidateDefaultIntervals() {
  while (true) {
    yield take(actions.MESSAGES.INVALIDATE_DEFAULT_INTERVALS);
    yield put(actions.requestDefaultIntervals());
  }
}


// Root Saga
export default function* root() {
  yield [
    fork(watchFetchUnits),
    fork(watchFetchAllUnits),
    fork(watchInvalidateUnitType),
    fork(watchFetchDefaultIntervals),
    fork(watchInvalidateDefaultIntervals)
  ];
}
