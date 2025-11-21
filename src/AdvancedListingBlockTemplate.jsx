import React, { useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import CommonItemRenderer from './CommonItemRenderer';
import processItemsForRecurrence from './processItemsForRecurrence';
import './Advanced.css'; // Import the CSS file

const AdvancedListingBlockTemplate = ({
  items,
  moreLinkText,
  moreLinkUrl,
  header,
  headerUrl,
  headerTag: HeaderTag = 'h2', // Default to <h2> if headerTag is not provided
  isEditMode,
  imageSide,
  imageWidth,
  howManyColumns,
  effectiveDate,
  expirationDate,
  titleTag,
  showDescription,
  eventDate,
  eventLocation,
  eventTime,
  showTitle,
  eventCard,
  quote,
  showRecurrence,
  fetchPriority,
  creatorauthor,
  readMore,
}) => {
  // Preprocess items for recurrence
  const processedItems = useMemo(() => {
    return showRecurrence
      ? processItemsForRecurrence(items)
      : items.map(item => ({
        ...item,
        url: flattenToAppURL(item['@id']),
      }));
  }, [items, showRecurrence]);

  const getLink = (url, text) => {
    if (!url) return null;
    return isInternalURL(url) ? (
      <Link to={flattenToAppURL(url)}>{text || url}</Link>
    ) : (
      <a href={url} target='_blank' rel='noopener noreferrer'>
        {text || url}
      </a>
    );
  };

  const moreLink = getLink(moreLinkUrl?.[0]?.['@id'], moreLinkText);
  const headerLink = getLink(headerUrl?.[0]?.['@id'], header);

  const columnClassMap = {
    1: 'twelve',
    2: 'six',
    3: 'four',
    4: 'three',
  };

  return (
    <div className='ui twelve column grid column-grid'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
      {processedItems.map((item, index) => (
        <div
          className={`${columnClassMap[howManyColumns] || 'four'} wide computer twelve wide mobile ${columnClassMap[howManyColumns] || 'four'
            } wide tablet column column-blocks-wrapper`}
          key={item['@id']}
        >
          <CommonItemRenderer
            items={[item]}
            index={index}
            showRecurrence={showRecurrence}
            quote={quote}
            showTitle={showTitle}
            eventCard={eventCard}
            titleTag={titleTag}
            eventDate={eventDate}
            eventTime={eventTime}
            eventLocation={eventLocation}
            showDescription={showDescription}
            effectiveDate={effectiveDate}
            expirationDate={expirationDate}
            isEditMode={isEditMode}
            imageSide={imageSide}
            imageWidth={imageWidth}
            howManyColumns={howManyColumns}
            fetchPriority={fetchPriority}
            creatorauthor={creatorauthor}
            readMore={readMore}
          />
        </div>
      ))}
      {moreLink && <div className='more-link'>{moreLink}</div>}
    </div>
  );
};

AdvancedListingBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  moreLinkText: PropTypes.string,
  moreLinkUrl: PropTypes.array,
  header: PropTypes.string,
  headerUrl: PropTypes.array,
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
  fetchPriority: PropTypes.string,
  creatorauthor: PropTypes.bool,
  readMore: PropTypes.bool,
};

export default React.memo(AdvancedListingBlockTemplate);
