import React from 'react';
import { Grid } from 'semantic-ui-react';
import CommonItemRenderer from './CommonItemRenderer';
import { renderImage } from './renderImage';

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
  const moreLink = getLink(moreLinkUrl?.[0]?.['@id'], moreLinkText);
  const headerLink = getLink(headerUrl?.[0]?.['@id'], header);

  const oneColumnElement = ['up', 'down', 'background', null].includes(imageSide);
  const columnSize = oneColumnElement ? 1 : 2;
  const imageGridWidth = oneColumnElement ? 12 : imageWidth || 2;
  const contentGridWidth = oneColumnElement ? 12 : hasImage ? 12 - imageWidth : 12;

  return (
    <div className='advancedView advancedList'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
      <Grid columns={howManyColumns || 1} stackable className={`column${howManyColumns}`}>
        <CommonItemRenderer
          items={items}
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
        />
      </Grid>
      {moreLink && <div className='more-link'>{moreLink}</div>}
    </div>
  );
};

AdvancedListingBlockTemplate.propTypes = {
  // (props definition)
};

export default React.memo(AdvancedListingBlockTemplate);
