import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from './reducers';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(browserHistory),
      loggerMiddleware
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index'); // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
