import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Header } from '../components';


class App extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(connect()(App));
