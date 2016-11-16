import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import { App, UnitGrid, Overview, UnitPage } from './containers';


export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/units/truck" />
    <Route path="units/:unitType" component={UnitGrid} />
    <Route path="units/:unitType/:unitID" component={UnitPage} />
    <Route path="overview" component={Overview} />
  </Route>
);
