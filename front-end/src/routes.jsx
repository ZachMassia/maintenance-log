import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './containers/app';
import UnitGrid from './components/unit-grid';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/units/truck" />
    <Route path="units/:unitType" component={UnitGrid} />
  </Route>
);
