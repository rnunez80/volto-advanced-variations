import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {flattenToAppURL} from '@plone/volto/helpers';
import {isInternalURL} from '@plone/volto/helpers/Url/Url';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {useIntl} from 'react-intl';
import {getEventCard, getEventDate, getEventTime} from './sharedUtils';
import processItemsForRecurrence from './processItemsForRecurrence';
import RenderImage from './renderImage';
import messages from './messages';

const AdvancedListMarkerBlockTemplate = ({
                                           items,
                                           showRecurrence,
                                           listMarker: listMarker = 'disc',
                                           showTitle: showTitle = true,
                                           titleTag: TitleTag = 'h2',
                                           eventCard,
                                           eventDate,
                                           eventTime,
                                           eventLocation,
                                           showDescription: showDescription = true,
                                           effectiveDate,
                                           expirationDate,
                                           isEditMode,
                                           creatorauthor,
                                           readMore,
                                           enableAnimation,
                                         }) => {
  const intl = useIntl();

  const processedItems = useMemo(() => {
    if (showRecurrence) {
      return processItemsForRecurrence(items);
    }
    return items.map(item => ({
      ...item,
      url: flattenToAppURL(item['@id']),
      imageSrc: item.image_field
        ? `${flattenToAppURL(item['@id'])}/@@images/image`
        : null,
    }));
  }, [items, showRecurrence]);

  const renderMetadata = useMemo(() => {
    return item => (
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
  }, [eventDate, eventTime]);

  const renderContent = item => (
    <>
      {showTitle && (
        <TitleTag className='threelines'>
          {!isEditMode ? (
            <Link to={item.url}>
              {item.title ? item.title : item.id}
            </Link>
          ) : (
            item.title || item.id
          )}
        </TitleTag>
      )}
      {(eventDate || eventTime || eventLocation) && (
        <div className='advancedDatetime'>
          {renderMetadata(item)}
          {eventLocation && <span className='location'> | {item.location}</span>}
        </div>
      )}
      {effectiveDate && <p className='effectiveDate'>{moment(item.effective).format('L')}</p>}
      {creatorauthor && <p className='author'>{item.Creator}</p>}
      {expirationDate && <p>Expiration: {moment(item.expires).format('L')}</p>}
      {showDescription && item.description && <p>{item.description}</p>}
      {readMore && (
        <div className='read-more'>
          {isInternalURL(item.url) ? (
            <Link
              to={item.url}
              className='ui button basic'
              aria-label={intl.formatMessage(messages.readMoreLabel, {
                title: item.title,
              })}
            >
              {intl.formatMessage(messages.readMoreButton)}
            </Link>
          ) : (
            <a
              href={item.url}
              className='ui button basic'
              aria-label={intl.formatMessage(messages.readMoreLabel, {
                title: item.title,
              })}
            >
              {intl.formatMessage(messages.readMoreButton)}
            </a>
          )}
        </div>
      )}
    </>
  );

  const listStyles = {
    none: 'none',
    disc: 'disc',
    circle: 'circle',
    square: 'square',
    decimal: 'decimal',
    'decimal-leading-zero': 'decimal-leading-zero',
    'lower-roman': 'lower-roman',
    'upper-roman': 'upper-roman',
    'lower-alpha': 'lower-alpha',
    'upper-alpha': 'upper-alpha',
  };

  const ListContainer = listMarker === 'none' ? 'div' : 'ul';
  const listItemTag = listMarker === 'none' ? 'div' : 'li';
  const listStyleType = listStyles[listMarker] || 'disc';

  const listItemClassName = listMarker === 'none' ? 'advanced-list-item no-bullets' : 'advanced-list-item';

  return (
    <div className={`fade-in loaded ${enableAnimation ? 'fade-in-enabled' : ''}`}>
      <ListContainer className={`advanced-list-${listMarker}`} style={{listStyleType}}>
        {processedItems.map(item => (
          <li key={item['@id']} className={listItemClassName}>
            {renderContent(item)}
          </li>
        ))}
      </ListContainer>
    </div>
  );
};

AdvancedListMarkerBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  showRecurrence: PropTypes.bool,
  listMarker: PropTypes.string,
  showTitle: PropTypes.bool,
  titleTag: PropTypes.string,
  eventCard: PropTypes.bool,
  eventDate: PropTypes.bool,
  eventTime: PropTypes.bool,
  eventLocation: PropTypes.bool,
  showDescription: PropTypes.bool,
  effectiveDate: PropTypes.bool,
  expirationDate: PropTypes.bool,
  isEditMode: PropTypes.bool,
  creatorauthor: PropTypes.bool,
  readMore: PropTypes.bool,
  enableAnimation: PropTypes.bool,
};

export default AdvancedListMarkerBlockTemplate;
