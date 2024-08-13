import React from 'react';
import Slider from 'react-slick';
import CommonItemRenderer from './CommonItemRenderer';
import { renderImage } from './renderImage';

const AdvancedCarouselBlockTemplate = ({
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
                                         showTitle,
                                         showDescription,
                                         eventDate,
                                         eventLocation,
                                         eventTime,
                                         slidesToScroll,
                                         autoPlay,
                                         autoplaySpeed,
                                         eventCard,
                                         quote,
                                         showRecurrence,
                                       }) => {
  const moreLink = getLink(moreLinkUrl?.[0]?.['@id'], moreLinkText);
  const headerLink = getLink(headerUrl?.[0]?.['@id'], header);

  return (
    <div className='advancedView'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}

      <Slider
        // (slider settings)
      >
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
      </Slider>
    </div>
  );
};

AdvancedCarouselBlockTemplate.propTypes = {
  // (props definition)
};

export default React.memo(AdvancedCarouselBlockTemplate);
