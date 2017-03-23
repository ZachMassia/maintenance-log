import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import { App, UnitGrid, Overview, UnitPage, Vis, Calibrations } from './containers';


export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/units/truck" />
    <Route path="units/:unitType" component={UnitGrid} />
    <Route path="units/:unitType/:unitID" component={UnitPage} />
    <Route path="overview" component={Overview} />
    <Route path="chart" component={Vis} />
    <Route path="calibrations" component={Calibrations} />
  </Route>
);
