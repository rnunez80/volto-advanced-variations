import messages from './messages';

export const mosaicListingSchema = (props) => {
    const { intl, schema } = props;

    const headingChoices = [
        ['h2', 'H2'],
        ['h3', 'H3'],
        ['h4', 'H4'],
        ['p', 'P'],
    ];

    const fetchPriorityChoices = [
        ['auto', 'Auto'],
        ['low', 'Low'],
        ['high', 'High'],
    ];

    return {
        ...schema,
        fieldsets: [
            ...schema.fieldsets,
            {
                id: 'mosaicDisplay',
                title: intl.formatMessage(messages.mosaicDisplayOptions),
                fields: [
                    'titleTag',
                    'fetchPriority',
                    'showDescription',
                    'effectiveDate',
                    'expirationDate',
                    'showStartDate',
                    'readMore',
                    'enableAnimation',
                ],
            },
        ],
        properties: {
            ...schema.properties,
            titleTag: {
                title: intl.formatMessage(messages.titleTag),
                choices: headingChoices,
                default: 'h3',
            },
            fetchPriority: {
                title: intl.formatMessage(messages.fetchPriority),
                choices: fetchPriorityChoices,
                default: 'auto',
            },
            showDescription: {
                title: intl.formatMessage(messages.descriptionTitle),
                type: 'boolean',
                default: true,
            },
            effectiveDate: {
                title: intl.formatMessage(messages.date),
                type: 'boolean',
                default: false,
            },
            expirationDate: {
                title: intl.formatMessage(messages.expires),
                type: 'boolean',
                default: false,
            },
            showStartDate: {
                title: intl.formatMessage(messages.showStartDate),
                type: 'boolean',
                default: false,
            },
            readMore: {
                title: intl.formatMessage(messages.readMore),
                type: 'boolean',
                default: true,
            },
            enableAnimation: {
                title: intl.formatMessage(messages.enableAnimation),
                type: 'boolean',
                default: false,
            },
        },
    };
};
