import { createSelector } from 'reselect';
import moment from 'moment';
import { taffy } from 'taffydb';
import { UNIT_TYPES, DB_DATE_FORMAT } from '../constants';


function createEvents(unitsByType, defaultIntervals) {
  // Which events to grab from each unit type.
  const eventsByUnitType = {
    tractor: ['safety_date'],
    trailer: ['safety_date', 'one_year_date', 'five_year_date'],
    truck: ['safety_date', 'one_year_date', 'five_year_date']
  };

  // How to display the event type in the calendar itself.
  const eventDisplayStrings = {
    safety_date: 'Safety',
    one_year_date: 'VK',
    five_year_date: 'IP UC'
  };

  const events = [];

  UNIT_TYPES.forEach((unitType) => {
    eventsByUnitType[unitType].forEach((eventType) => {
      // Save the event display string to avoid multiple lookups.
      const eventStr = eventDisplayStrings[eventType];

      // Push all events for a given unitType -> eventType pair into the events array.
      if (unitsByType[unitType].units.length > 0) {
        events.push(...unitsByType[unitType].units.map((unit) => {
          // Grab the default interval.
          // TODO: Allow interval overrides.
          const interval = defaultIntervals({
            unit_type: unitType,
            service_type: eventType.replace('_date', '')
          }).first().interval;

          let eventDate = moment(unit[eventType], DB_DATE_FORMAT);
          eventDate.add(interval, 'days');

          if (eventType === 'safety_date') {
            // A safety is due on the last day of the month it was done.
            eventDate = eventDate.endOf('month');
          }

          return {
            title: `${unit.unit_num} - ${eventStr}`,
            allDay: true,
            start: eventDate,
            end: eventDate,
            unitID: unit.id,
            unitType,
            eventType
          };
        }));
      }
    });
  });
  return events;
}

// TODO: Split into each unit type to avoid redoing the whole array.
const getUnitsByType = state => state.unitsByType;
const getDefaultIntervals = state => state.defaultIntervals.intervals;

const getEvents = createSelector(
  [getUnitsByType, getDefaultIntervals],
  (unitsByType, defaultIntervals) => {
    if (UNIT_TYPES.map(t => t in unitsByType).includes(false) ||
        !defaultIntervals.length) {
      return [];
    }
    return createEvents(unitsByType, taffy(defaultIntervals));
  }
);

export default getEvents;
