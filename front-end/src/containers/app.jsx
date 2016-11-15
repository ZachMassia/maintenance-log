import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Grid } from 'react-bootstrap';

import { Header } from '../components';


class App extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <Grid fluid={true}>
        <Header />
        {this.props.children}
      </Grid>
    );
  }
}

export default withRouter(connect()(App));
