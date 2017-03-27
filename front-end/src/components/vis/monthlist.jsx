import React, { PropTypes } from 'react';
import { Col, Badge, ListGroup, ListGroupItem, Label } from 'react-bootstrap';

const MonthListItem = ({ event, clickHandler }) => {
  const [unitNum, evDispStr] = event.title.split(' - ');

  return (
    <ListGroupItem key={`${event.unitID}-${event.eventType}`} onClick={clickHandler}>
      {unitNum} <Label bsStyle="primary">{evDispStr}</Label>
    </ListGroupItem>
  );
};

MonthListItem.propTypes = {
  event: PropTypes.object.isRequired,
  clickHandler: PropTypes.func.isRequired
};


const MonthList = ({ month, events, itemClickHandler }) =>
  <Col lg={3} key={`col-${month}`}>
    <h3>{month} <Badge>{events.length}</Badge></h3>
    <ListGroup>
      {events.map(e =>
        <MonthListItem event={e} clickHandler={itemClickHandler(e)} />)
      }
    </ListGroup>
  </Col>;

MonthList.propTypes = {
  month: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  itemClickHandler: PropTypes.func.isRequired
};

export default MonthList;
