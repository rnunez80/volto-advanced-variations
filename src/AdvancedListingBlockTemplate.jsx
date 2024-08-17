import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Grid } from 'semantic-ui-react';
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

  return (
    <div className='advancedView advancedList'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
      <Grid columns={howManyColumns || 1} stackable className={`column${howManyColumns}`}>
        {items.map((item) => (
          <div className='ui one column grid advanced-item' key={item['@id']}>
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
            />
          </div>
        ))}
      </Grid>
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
};

export default React.memo(AdvancedListingBlockTemplate);
