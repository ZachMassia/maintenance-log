import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './configureStore';
import routes from './routes';

require('../node_modules/bootstrap/dist/css/bootstrap.min.css');


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);


/*
  Basic "shape" of store data.

  {
    selectedUnitType: 'truck',
    unitsByType {
      tractor: {
        isFetching: false,
        didInvalidate: false,
        units: [
          {
            id: 1,
            unit_num: 109,
            ...
          }
        ]
      },
      trailer: {
        ...
      },
      truck: {
        ...
      }
    }
  }
*/
