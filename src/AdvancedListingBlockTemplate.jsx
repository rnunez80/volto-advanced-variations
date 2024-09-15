import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import CommonItemRenderer from './CommonItemRenderer';
import './Advanced.css'; // Import the CSS file

const AdvancedListingBlockTemplate = ({
                                        items,
                                        moreLinkText,
                                        moreLinkUrl,
                                        header,
                                        headerUrl,
                                        headerTag,
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
                                      }) => {

  const getLink = (url, text) => {
    if (!url) return null;
    return isInternalURL(url) ? (
      <Link to={flattenToAppURL(url)}>{text || url}</Link>
    ) : (
      <a href={url} target='_blank'>{text || url}</a>
    );
  };

  const moreLink = getLink(moreLinkUrl?.[0]?.['@id'], moreLinkText);
  const headerLink = getLink(headerUrl?.[0]?.['@id'], header);

  const hasImage = imageSide !== null;
  const oneColumnElement = ['up', 'down', 'background', null].includes(imageSide);
  const columnSize = oneColumnElement ? 1 : 2;
  const imageGridWidth = oneColumnElement ? 12 : imageWidth || 2;
  const contentGridWidth = oneColumnElement ? 12 : hasImage ? 12 - imageWidth : 12;

  const columnClassMap = {
    1: 'twelve',
    2: 'six',
    3: 'four',
    4: 'three',
  };

  return (
    <div className='ui twelve column grid column-grid'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
        {items.map((item) => (
          <div
            className={`${columnClassMap[howManyColumns] || 'four'} wide computer twelve wide mobile ${columnClassMap[howManyColumns] || 'four'} wide tablet column column-blocks-wrapper`}
            key={item['@id']}
          >
            <CommonItemRenderer
              items={[item]}
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
              imageSide={imageSide} // Pass the image side information
              imageWidth={imageWidth} // Pass the image width information
              howManyColumns={howManyColumns} // Pass the column configuration
              fetchPriority={fetchPriority} // Pass the fetch priority information
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
};

export default React.memo(AdvancedListingBlockTemplate);
