import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Col, Row, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { UNIT_TYPES } from '../constants';

import MacEwenLogo from '../static/macewen_logo.jpg';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default class NavHeader extends Component {
  render() {
    return (
      <Col>
        <Row>
          <Navbar>
            <Navbar.Header>
              <LinkContainer to={{ pathname: '/' }}>
                <Navbar.Brand>
                  <Image src={MacEwenLogo} responsive style={{ margin: 'auto' }} />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <LinkContainer to={{ pathname: '/overview' }}>
                  <NavItem eventKey={1}>Overview</NavItem>
                </LinkContainer>
                <LinkContainer to={{ pathname: '/chart' }}>
                  <NavItem eventKey={2}>Charts</NavItem>
                </LinkContainer>
                <NavDropdown eventKey={3} title="Unit Lists" id="basic-nav-dropdown">
                  {UNIT_TYPES.map((unit, index) =>
                    <LinkContainer to={{ pathname: `/units/${unit}` }} key={unit}>
                      <MenuItem eventKey={3 + (index / 10)}>
                        {capitalize(unit)}
                      </MenuItem>
                    </LinkContainer>)
                  }
                </NavDropdown>
                <LinkContainer to={{ pathname: '/calibrations' }}>
                  <NavItem eventKey={4}>Calibrations</NavItem>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Col>
    );
  }
}
