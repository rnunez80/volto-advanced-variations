import messages from './messages';

export const advancedTableSchema = (props) => {
  const { intl, schema, formData } = props;

  const headingChoices = [
    ['h2', 'H2'],
    ['h3', 'H3'],
    ['h4', 'H4'],
    ['p', 'P'],
  ];

  return {
    ...schema,
    fieldsets: [
      ...schema.fieldsets,
      {
        id: 'tableDisplay',
        title: 'Table Display Options',
        fields: [
          'showTitle',
          'showDescription',
          'effectiveDate',
          'expirationDate',
          'eventCard',
          'eventDate',
          'eventTime',
          'eventLocation',
          'creatorauthor',
        ],
      },
    ],
    properties: {
      ...schema.properties,
      titleTag: {
        title: intl.formatMessage(messages.titleTag),
        choices: headingChoices,
        default: 'h2',
      },
      showTitle: {
        title: intl.formatMessage(messages.showTitle),
        type: 'boolean',
        default: true,
      },
      showDescription: {
        title: intl.formatMessage(messages.descriptionTitle),
        type: 'boolean',
        default: true,
      },
      effectiveDate: {
        title: intl.formatMessage(messages.date),
        type: 'boolean',
      },
      expirationDate: {
        title: intl.formatMessage(messages.expires),
        type: 'boolean',
      },
      eventCard: {
        title: intl.formatMessage(messages.showEventCard),
        type: 'boolean',
      },
      eventDate: {
        title: intl.formatMessage(messages.eventDate),
        type: 'boolean',
      },
      eventTime: {
        title: intl.formatMessage(messages.eventTime),
        type: 'boolean',
      },
      eventLocation: {
        title: intl.formatMessage(messages.eventLocation),
        type: 'boolean',
      },
      showRecurrence: {
        title: intl.formatMessage(messages.showRecurrence),
        description: intl.formatMessage(messages.showRecurrenceDescription),
        type: 'boolean',
      },
      creatorauthor: {
        title: intl.formatMessage(messages.showcreatorauthor),
        type: 'boolean',
      },
      readMore: {
        title: intl.formatMessage(messages.readMore),
        type: 'boolean',
      },
      enableAnimation: {
        title: intl.formatMessage(messages.enableAnimation),
        type: 'boolean',
      },
    },
  };
};
