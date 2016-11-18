import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Col, Row, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { UNIT_TYPES } from '../constants';

import MacEwenLogo from '../static/macewen_logo.jpg';


export default class NavHeader extends Component {
  render() {
    return (
      <Col>
        <Row>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <LinkContainer to={{pathname: '/'}}>
                  <Image src={MacEwenLogo} />
                </LinkContainer>

              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <LinkContainer to={{pathname: '/overview'}}>
                  <NavItem eventKey={1}>Overview</NavItem>
                </LinkContainer>
                <NavDropdown eventKey={2} title="Unit Lists" id="basic-nav-dropdown">
                  {UNIT_TYPES.map((unit, index) =>
                    <LinkContainer to={{pathname: `/units/${unit}`}} key={index}>
                      <MenuItem eventKey={2 + (index / 10)}>
                        {unit}
                      </MenuItem>
                    </LinkContainer>)
                  }
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Col>
    );
  }
}
