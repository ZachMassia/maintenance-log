import React, { Component } from 'react';
import { Jumbotron, Image, Col, Row, Grid } from 'react-bootstrap';

import MacEwenLogo from '../static/macewen_logo.jpg';

export default class Header extends Component {
  render() {
    return (
      <Jumbotron>
        <Grid>
          <Row>
            <Col xs={4}><Image src={MacEwenLogo} responsive /></Col>
            <Col xs={8}><h1>Maintenance Log</h1></Col>
          </Row>
        </Grid>
      </Jumbotron>
    );
  }
}
