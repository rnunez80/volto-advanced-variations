import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { RRule, rrulestr } from 'rrule';

const processItemsForRecurrence = (originalItems) => {
  const today = new Date();
  const newItems = [];

  originalItems.forEach((item) => {
    let firstFutureRecurrenceAdded = false; // Track if first future recurrence is added

    if (item.recurrence && item.recurrence.startsWith('DTSTART')) {
      let recurrence = item.recurrence;
      if (item.recurrence.indexOf('DTSTART') < 0) {
        var dtstart = RRule.optionsToString({
          dtstart: new Date(item.start),
        });
        recurrence = dtstart + '\n' + recurrence;
      }

      const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

      rrule.all().forEach((date) => {
        const futureDate = new Date(date);
        if (futureDate > today) {
          if (!firstFutureRecurrenceAdded || rrule.all().indexOf(date) === 1) {
            // Add the item if it's the first future recurrence or the second occurrence
            const dateStr = `${futureDate.getFullYear()}-${(futureDate.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${futureDate.getDate().toString().padStart(2, '0')}`;
            const startTime = new Date(item.start).toTimeString().split(' ')[0];
            const endTime = new Date(item.end).toTimeString().split(' ')[0];
            const startStr = `${dateStr}T${startTime}`;
            const endStr = `${dateStr}T${endTime}`;

            newItems.push({
              title: item.title,
              start: startStr,
              end: endStr,
              url: flattenToAppURL(item['@id']),
              effective: item.effective,
              expires: item.expires,
              description: item.description,
              location: item.location,
              ['@id']: `${item['@id']}#${startStr}`,
              ['@type']: item['@type'],
              image_field: item.image_field,
            });
          firstFutureRecurrenceAdded = true;  // Mark that the first future recurrence is added
          }
        }
      });
      }
    else
      {
        newItems.push({
          title: item.title,
          start: item.start,
          end: item.end,
          url: flattenToAppURL(item['@id']),
          effective: item.effective,
          expires: item.expires,
          description: item.description,
          location: item.location,
          ['@id']: `${item['@id']}`,
          ['@type']: item['@type'],
          image_field: item.image_field,
        });
      }
    }
  )
    ;

    // Sort items by 'start'
    newItems.sort((a, b) => new Date(a.start) - new Date(b.start));
    return newItems;
  };

  export default processItemsForRecurrence;
