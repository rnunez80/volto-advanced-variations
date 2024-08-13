import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { getEventCard, getEventDate, getEventTime } from './sharedUtils';

const CommonItemRenderer = ({
                              items,
                              showRecurrence,
                              quote,
                              showTitle,
                              eventCard,
                              titleTag: TitleTag = 'h3',
                              eventDate,
                              eventTime,
                              eventLocation,
                              showDescription,
                              effectiveDate,
                              expirationDate,
                              isEditMode,
                            }) => {
  const intl = useIntl();

  // Memoize processed items to avoid unnecessary recalculations
  const processedItems = useMemo(() => {
    if (showRecurrence) {
      return processItemsForRecurrence(items);
    }
    return items.map(item => ({
      ...item,
      url: flattenToAppURL(item['@id']),
    }));
  }, [items, showRecurrence]);

  const renderMetadata = item => (
    <>
      {eventDate && <span className='start-date'>{getEventDate(item)}</span>}
      {eventTime && eventDate && <span> | </span>}
      {eventTime && (
        <span className='start-time'>
          {getEventTime(item) === '12:00 AM - 11:59 PM' ? 'All Day' : getEventTime(item)}
        </span>
      )}
    </>
  );

  const renderContent = item => (
    <>
      {quote && (
        <>
          <blockquote>{item.description}</blockquote>
          <div className='styled-slate right has--align--right align styled'>
            {item.title || item.id}
          </div>
        </>
      )}
      {eventCard && getEventCard(item)}
      {showTitle && (
        <TitleTag>
          <Link to={item.url}>{item.title || item.id}</Link>
        </TitleTag>
      )}
      {(eventDate || eventTime) && (
        <p className='event-when'>{renderMetadata(item)}</p>
      )}
      {eventLocation && <p>{item.location}</p>}
      {effectiveDate && <p>{moment(item.effective).format('L')}</p>}
      {expirationDate && <p>Expiration: {moment(item.expires).format('L')}</p>}
      {showDescription && item.description && <p>{item.description}</p>}
    </>
  );

  return (
    <>
      {processedItems.map(item => (
        <div key={item['@id']}>{renderContent(item)}</div>
      ))}
    </>
  );
};

CommonItemRenderer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  showRecurrence: PropTypes.bool,
  quote: PropTypes.bool,
  showTitle: PropTypes.bool,
  eventCard: PropTypes.bool,
  titleTag: PropTypes.string,
  eventDate: PropTypes.bool,
  eventTime: PropTypes.bool,
  eventLocation: PropTypes.bool,
  showDescription: PropTypes.bool,
  effectiveDate: PropTypes.bool,
  expirationDate: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

export default CommonItemRenderer;
