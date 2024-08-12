import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { getEventDate, getEventTime } from './sharedUtils';

const AdvancedListingBlockTemplate = ({
                                        items,
                                        moreLinkText,
                                        moreLinkUrl,
                                        header,
                                        headerUrl,
                                        headerTag: HeaderTag = 'h2',
                                        isEditMode,
                                        imageSide = 'left',
                                        imageWidth,
                                        howManyColumns,
                                        effectiveDate,
                                        expirationDate,
                                        titleTag: TitleTag = 'h3',
                                        showDescription,
                                        eventDate,
                                        eventLocation,
                                        eventTime,
                                        showTitle,
                                        eventCard,
                                        quote,
                                        showRecurrence,
                                      }) => {
  const columnSize = howManyColumns > 1 ? howManyColumns : 'one';

  const processedItems = items.map((item) => ({
    ...item,
    image_field: item.image_field || (item.image ? item.image.download : null),
  }));

  let moreLink = null;
  let moreHref = moreLinkUrl?.[0]?.['@id'] || '';
  if (isInternalURL(moreHref)) {
    moreLink = (
      <Link to={flattenToAppURL(moreHref)} className='ui button'>
        {moreLinkText || 'More'}
      </Link>
    );
  }

  return (
    <div className='advanced-listing-block'>
      {header && (
        <HeaderTag className='listing-header'>
          {headerUrl ? (
            <Link to={flattenToAppURL(headerUrl)}>{header}</Link>
          ) : (
            header
          )}
        </HeaderTag>
      )}
      {processedItems.map((item, index) => (
        <Grid
          key={index}
          columns={columnSize}
          className='advanced-item'
          verticalAlign='middle'
        >
          {['left', 'up'].includes(imageSide) && (
            <Grid.Column width={imageGridWidth}>
              {renderImage(item, isEditMode, howManyColumns)}
            </Grid.Column>
          )}
          <Grid.Column>
            {showTitle && (
              <TitleTag>
                <Link to={item.url} condition={!isEditMode}>
                  {item.title ? item.title : item.id}
                </Link>
              </TitleTag>
            )}
            {(item.start && (eventDate || eventTime) && (
                <p className='event-when'>
                  {eventDate && (
                    <span className='start-date'>{getEventDate(item)}</span>
                  )}
                  {eventTime && eventDate && <span> | </span>}
                  {eventTime && (
                    <span className='start-time'>
                    {getEventTime(item)}
                  </span>
                  )}
                </p>
              )) ||
              null}
            {eventLocation && <p>{item.location}</p>}
            {effectiveDate && <p>{moment(item.effective).format('L')}</p>}
            {expirationDate && (
              <p>Expiration: {moment(item.expires).format('L')}</p>
            )}
            {showDescription && item.description && <p>{item.description}</p>}
          </Grid.Column>
          {['right', 'down'].includes(imageSide) && (
            <Grid.Column width={imageGridWidth}>
              {renderImage(item, isEditMode, howManyColumns)}
            </Grid.Column>
          )}
        </Grid>
      ))}
      {moreLink && <div className='more-link'>{moreLink}</div>}
    </div>
  );
};

AdvancedListingBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  moreLinkText: PropTypes.string,
  moreLinkUrl: PropTypes.array,
  header: PropTypes.string,
  headerUrl: PropTypes.string,
  headerTag: PropTypes.string,
  isEditMode: PropTypes.bool,
  imageSide: PropTypes.string,
  imageWidth: PropTypes.number,
  howManyColumns: PropTypes.number,
  effectiveDate: PropTypes.bool,
  expirationDate: PropTypes.bool,
  titleTag: PropTypes.string,
  showDescription: PropTypes.bool,
  eventDate: PropTypes.bool,
  eventLocation: PropTypes.bool,
  eventTime: PropTypes.bool,
  showTitle: PropTypes.bool,
  eventCard: PropTypes.bool,
  quote: PropTypes.bool,
  showRecurrence: PropTypes.bool,
};

export default injectIntl(AdvancedListingBlockTemplate);
