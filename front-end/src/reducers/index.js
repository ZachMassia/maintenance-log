import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import unitsByType from './units';
import defaultIntervals from './intervals';


const rootReducer = combineReducers({
  unitsByType,
  defaultIntervals,
  routing
});

export default rootReducer;
