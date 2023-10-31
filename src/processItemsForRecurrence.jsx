import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { RRule, rrulestr } from 'rrule';

const processItemsForRecurrence = (originalItems) => {
  const today = new Date();
  const newItems = [];

  originalItems.forEach((item) => {
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
        let futureDate = new Date(date);
        let dateStr = `${futureDate.getFullYear()}-${(futureDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${futureDate.getDate().toString().padStart(2, '0')}`;

        // Extract time from original start and end dates
        let startTime = new Date(item.start).toTimeString().split(' ')[0];
        let endTime = new Date(item.end).toTimeString().split(' ')[0];

        // Combine with future date
        let startStr = `${dateStr}T${startTime}`;
        let endStr = `${dateStr}T${endTime}`;

        // Only push if the date is in the future
        if (futureDate > today) {
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
        }
      });
    } else {
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
  });

  // Sort items by 'start'
  newItems.sort((a, b) => new Date(a.start) - new Date(b.start));
  return newItems;
};

export default processItemsForRecurrence;
