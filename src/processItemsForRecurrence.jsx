import { flattenToAppURL } from '@plone/volto/helpers';
import { RRule, rrulestr } from 'rrule';

const processItemsForRecurrence = (originalItems) => {
  const today = new Date();
  const newItems = [];

  originalItems.forEach((item) => {
    let firstFutureRecurrenceAdded = false; // Track if first future recurrence is added

    if (item.recurrence && item.recurrence.startsWith('DTSTART')) {
      let recurrence = item.recurrence;

      // Add DTSTART if missing in the recurrence rule
      if (item.recurrence.indexOf('DTSTART') < 0) {
        const dtstart = RRule.optionsToString({
          dtstart: new Date(item.start),
        });
        recurrence = `${dtstart}\n${recurrence}`;
      }

      const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

      // Iterate over all occurrences of the recurrence rule
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
              url: flattenToAppURL(item['@id']), // Always use the original URL
              effective: item.effective,
              expires: item.expires,
              description: item.description,
              location: item.location,
              ['@id']: `${item['@id']}`, // Unique ID for each recurrence
              ['@type']: item['@type'],
              image_field: item.image_field
                ? flattenToAppURL(item.image_field) // Flatten the image_field URL
                : null,
            });

            firstFutureRecurrenceAdded = true; // Mark that the first future recurrence is added
          }
        }
      });
    } else {
      // Add non-recurring items directly
      newItems.push({
        title: item.title,
        start: item.start,
        end: item.end,
        url: flattenToAppURL(item['@id']), // Always use the original URL
        effective: item.effective,
        expires: item.expires,
        description: item.description,
        location: item.location,
        ['@id']: item['@id'], // Original ID for non-recurring events
        ['@type']: item['@type'],
        image_field: item.image_field
          ? flattenToAppURL(item.image_field) // Flatten the image_field URL
          : null,
      });
    }
  });

  // Sort items by 'start' date
  newItems.sort((a, b) => new Date(a.start) - new Date(b.start));
  return newItems;
};

export default processItemsForRecurrence;
