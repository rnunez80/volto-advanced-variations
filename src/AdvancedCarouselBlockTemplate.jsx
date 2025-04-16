import React, { useMemo, useRef, useState } from 'react';
import { Image } from 'semantic-ui-react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import CommonItemRenderer from './CommonItemRenderer';
import processItemsForRecurrence from './processItemsForRecurrence';
import PropTypes from 'prop-types'; // Import PropTypes
import './Advanced.css'; // Import the CSS file

const useSliderControls = () => {
  const sliderRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (isPlaying) {
      sliderRef.current.slickPause();
    } else {
      sliderRef.current.slickPlay();
    }
    setIsPlaying(!isPlaying);
  };

  return { sliderRef, isPlaying, togglePlay };
};

const AdvancedCarouselBlockTemplate = ({
                                         items,
                                         moreLinkText,
                                         moreLinkUrl,
                                         header,
                                         headerUrl,
                                         headerTag: HeaderTag = 'p', // Default header tag
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
                                         slidesToScroll: slidesToScroll = 1,
                                         autoPlay: autoPlay = true,
                                         autoplaySpeed: autoplaySpeed = 5,
                                         eventCard,
                                         quote,
                                         showRecurrence,
                                         fetchPriority,
                                       }) => {
  const { sliderRef, isPlaying, togglePlay } = useSliderControls();

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

  return (
    <div className='advancedView advancedSlider'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}

      <Slider
        ref={sliderRef}
        className={`column${howManyColumns}`}
        dots
        infinite
        lazyLoad
        speed={500}
        slidesToShow={howManyColumns || 1}
        slidesToScroll={slidesToScroll || 1}
        autoplay={autoPlay}
        autoplaySpeed={autoplaySpeed * 1000}
        pauseOnHover={false}
        arrows
        responsive={
          howManyColumns >= 3
            ? [
              { breakpoint: 1169, settings: { slidesToShow: 3 } },
              { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
              { breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            ]
            : [{ breakpoint: 767, settings: { slidesToShow: 1, slidesToScroll: 1 } }]
        }
      >
        {processedItems.map(item => (
          <div key={item['@id']}>
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
              imageSide={imageSide}
              imageWidth={imageWidth}
              howManyColumns={howManyColumns}
              fetchPriority={fetchPriority}
            />
          </div>
        ))}
      </Slider>

      <button className='ui circular button playpause' onClick={togglePlay}>
        {isPlaying ? (
          <Image
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEgMjJoLTR2LTIwaDR2MjB6bTYtMjBoLTR2MjBoNHYtMjB6Ii8+PC9zdmc+'
            alt='Pause Slideshow'
          />
        ) : (
          <Image
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAyMnYtMjBsMTggMTAtMTggMTB6Ii8+PC9zdmc+'
            alt='Play Slideshow'
          />
        )}
      </button>
    </div>
  );
};

AdvancedCarouselBlockTemplate.propTypes = {
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
  showTitle: PropTypes.bool,
  showDescription: PropTypes.bool,
  eventDate: PropTypes.bool,
  eventLocation: PropTypes.bool,
  eventTime: PropTypes.bool,
  slidesToScroll: PropTypes.number,
  autoPlay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  eventCard: PropTypes.bool,
  quote: PropTypes.bool,
  showRecurrence: PropTypes.bool,
  fetchPriority: PropTypes.string,
};

export default React.memo(AdvancedCarouselBlockTemplate);
