import { createSelector } from 'reselect';
import moment from 'moment';
import { taffy } from 'taffydb';

import getEvents from './events';

const eventBarNames = {
  safety_date: 'Safety',
  one_year_date: 'VK',
  five_year_date: 'IP UC'
};

function createBreakdown(events) {
  const data = taffy(moment.monthsShort().map(month => ({
    month,
    Safety: 0,
    VK: 0,
    'IP UC': 0,
    events: []
  })));

  // If there are no events, just return the initial data with 0 values for each event type.
  if (!events.length) return data().get();

  const pairs = [
    ['tractor', 'safety_date'],
    ['trailer', 'one_year_date'],
    ['trailer', 'five_year_date'],
    ['truck', 'one_year_date'],
    ['truck', 'five_year_date']
  ].map(pair => ({ unitType: pair[0], eventType: pair[1] }));

  const eventsDB = taffy(events);

  // Loop over each pair of unit->event and query the data for the matching
  // events. Add each event to the events array of it's corresponding month,
  // and increment the counter for the given event type.
  pairs.forEach((query) => {
    eventsDB(query).each((event) => {
      const key = eventBarNames[event.eventType];
      data({ month: event.start.format('MMM') })
        .update(function () {
          // Make sure this is an event for the current year.
          if (event.start.year() !== moment().year()) return this;

          this[key] += 1;
          this.events.push(event);
          return this;
        }
      );
    });
  });

  return data().get();
}


const getMonthBreakdown = createSelector(getEvents, createBreakdown);

export default getMonthBreakdown;
