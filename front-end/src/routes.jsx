import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import { App, UnitGrid, Overview } from './containers';


export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/units/truck" />
    <Route path="units/:unitType" component={UnitGrid} />
    <Route path="overview" component={Overview} />
  </Route>
);
