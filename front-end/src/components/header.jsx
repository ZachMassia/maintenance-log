import React, {Component, PropTypes} from 'react';
import {Jumbotron, Image, Col, Row, Grid} from 'react-bootstrap';


export default class Header extends Component {
	render() {
		return (
			<Jumbotron>
				<Grid>
					<Row>
  					<Col sm={4}><Image src="images/macewen_logo.jpg" rounded /></Col>
						<Col sm={8}><h1>Maintenance Log</h1></Col>
					</Row>
				</Grid>
  		</Jumbotron>
		);
	}
}
