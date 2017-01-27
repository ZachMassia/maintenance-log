import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from './reducers';

const loggerMiddleware = createLogger({ collapsed: true });
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      sagaMiddleware,
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

  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);

  return store;
}
