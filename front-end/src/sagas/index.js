import { fork } from 'redux-saga/effects';

import unitRoot from './units';


export default function* rootSaga() {
  yield [
    fork(unitRoot)
  ];
}
