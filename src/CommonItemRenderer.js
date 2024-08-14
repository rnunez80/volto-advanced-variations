import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { getEventCard, getEventDate, getEventTime } from './sharedUtils';
import processItemsForRecurrence from './processItemsForRecurrence';
import renderImage from './renderImage';

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
                              imageSide,
                              imageWidth,
                              howManyColumns,
                            }) => {
  const intl = useIntl();

  const processedItems = useMemo(() => {
    if (showRecurrence) {
      return processItemsForRecurrence(items);
    }
    return items.map(item => ({
      ...item,
      url: flattenToAppURL(item['@id']),
      imageSrc: item.image_field ? `${flattenToAppURL(item['@id'])}/@@images/preview_image` : null,  // Correct the image URL
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
        <TitleTag className='threelines'>
          {imageSide === 'background' ? (
            item.title || item.id
          ) : (
            <Link to={item.url} condition={!isEditMode}>
              {item.title ? item.title : item.id}
            </Link>
          )}
        </TitleTag>
      )}
      {(eventDate || eventTime) && (
        <p>{renderMetadata(item)}</p>
      )}
      {eventLocation && <p>{item.location}</p>}
      {effectiveDate && <p className='effectiveDate'>{moment(item.effective).format('L')}</p>}
      {expirationDate && <p>Expiration: {moment(item.expires).format('L')}</p>}
      {showDescription && item.description && (
        <p>{item.description}</p>
      )}
    </>
  );

  return (
    <>
      {processedItems.map(item => (
        <div key={item['@id']} className='ui one column grid advanced-item'>
          <div className={`column ${imageSide}`}>
            {imageSide === 'background' ? (
              <div className='backgroundimage'>
                <Link to={item.url} condition={!isEditMode}>
                  <div className='focuspoint'>
                    {item.imageSrc ? (
                      <img
                        sizes='(min-width: 768px) and (max-width: 991px) 171px, (min-width: 992px) and (max-width: 1199px) 223px, (min-width: 1200px) 272px'
                        srcSet={`
                          ${item.imageSrc}/mini 200w,
                          ${item.imageSrc}/preview 400w,
                          ${item.imageSrc}/teaser 600w,
                          ${item.imageSrc}/large 800w,
                          ${item.imageSrc}/larger 1000w,
                          ${item.imageSrc}/great 1200w,
                          ${item.imageSrc}/huge 1600w
                        `}
                        src={`${item.imageSrc}/preview`}
                        alt={item.title || ''}
                        className='ui image listImage'
                        loading='lazy'
                      />
                    ) : (
                      renderImage(item, isEditMode, howManyColumns)
                    )}
                  </div>
                  <div className='info-text'>{renderContent(item)}</div>
                </Link>
              </div>
            ) : (
              <>
                {['up', 'left'].includes(imageSide) && (
                  <div className='twelve wide column advancedImage'>
                    {renderImage(item, isEditMode, howManyColumns)}
                  </div>
                )}
                {renderContent(item)}
                {['right', 'down'].includes(imageSide) && (
                  <div className='twelve wide column advancedImage'>
                    {renderImage(item, isEditMode, howManyColumns)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
  imageSide: PropTypes.string,
  imageWidth: PropTypes.number,
  howManyColumns: PropTypes.number,
};

export default CommonItemRenderer;
