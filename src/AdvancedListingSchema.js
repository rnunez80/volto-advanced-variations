import messages from './messages';

export const advancedListingSchema = (props) => {
  const {intl, schema, formData} = props;
  // const imageWidth = ['right', 'left'].includes(formData.imageSide)
  //   ? ['imageWidth']
  //   : [];
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
        id: 'listingDisplay',
        title: intl.formatMessage(messages.itemDisplayOptions),
        fields: ['titleTag', 'howManyColumns', 'imageSide', 'imageWidth', 'showTitle', 'showDescription', 'eventCard', 'eventDate', 'eventTime', 'eventLocation', 'effectiveDate','quote'],
      },
    ],
    properties: {
      ...schema.properties,
      titleTag: {
        title: intl.formatMessage(messages.titleTag),
        choices: headingChoices,
        default: 'h2',
      },
      howManyColumns: {
        title: intl.formatMessage(messages.columnsCount),
        choices: [
          [1, '1'],
          [2, '2'],
          [3, '3'],
          [4, '4'],
        ],
        default: 2,
      },
      imageWidth: {
        title: intl.formatMessage(messages.imageWidth),
        description: intl.formatMessage(messages.imageWidthDescription),
        choices: [
          [2, '2/12'],
          [3, '3/12'],
          [4, '4/12'],
          [5, '5/12'],
          [6, '6/12'],
        ],
        default: 4,
      },
      imageSide: {
        title: intl.formatMessage(messages.imagePosition),
        choices: [
          [null, intl.formatMessage(messages.noImage)],
          ['background', intl.formatMessage(messages.background)],
          ['up', intl.formatMessage(messages.up)],
          ['left', intl.formatMessage(messages.left)],
          ['right', intl.formatMessage(messages.right)],
          ['down', intl.formatMessage(messages.down)],
        ],
        default: 'up',
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
      quote: {
        title: intl.formatMessage(messages.showAsQuote),
        type: 'boolean',
      },
    },
  };
};
