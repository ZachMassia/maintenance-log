import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './configureStore';
import Root from './containers/root';

require('../node_modules/bootstrap/dist/css/bootstrap.min.css');


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history} />,
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
