import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid } from 'react-bootstrap';

import { Header, NavHeader } from '../components';


class App extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <Grid fluid={true}>
        <Header />
        <NavHeader />
        {this.props.children}
      </Grid>
    );
  }
}

export default withRouter(connect()(App));
