import messages from './messages';

export const advancedListMarkerSchema = (props) => {
  const { intl, schema, formData } = props;

  const headingChoices = [
    ['strong', 'strong'],
    ['h2', 'H2'],
    ['h3', 'H3'],
    ['h4', 'H4'],
    ['p', 'P'],
  ];

  const listMarkerChoices = [
    ['none', 'None'],
    ['disc', 'Disc'],
    ['circle', 'Circle'],
    ['square', 'Square'],
    ['decimal', 'Decimal'],
    ['decimal-leading-zero', 'Decimal Leading Zero'],
    ['lower-roman', 'Lower Roman'],
    ['upper-roman', 'Upper Roman'],
    ['lower-alpha', 'Lower Alpha'],
    ['upper-alpha', 'Upper Alpha'],
  ];

  return {
    ...schema,
    fieldsets: [
      ...schema.fieldsets,
      {
        id: 'listDisplay',
        title: intl.formatMessage(messages.listDisplayOptions),
        fields: [
          'titleTag',
          'listMarker',
          'showTitle',
          'showDescription',
          'effectiveDate',
          'expirationDate',
          'creatorauthor',
          'readMore',
        ],
      },
      {
        id: 'itemEventOptions',
        title: intl.formatMessage(messages.itemEventOptions),
        fields: [
          'eventDate',
          'eventTime',
          'eventLocation',
          'showRecurrence',
        ],
      },
    ],
    properties: {
      ...schema.properties,
      titleTag: {
        title: intl.formatMessage(messages.titleTag),
        choices: headingChoices,
        default: 'strong',
      },
      listMarker: {
        title: intl.formatMessage(messages.listMarker),
        choices: listMarkerChoices,
        default: 'disc',
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
