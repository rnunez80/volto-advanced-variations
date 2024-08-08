import React, { Suspense, useState } from 'react';
import { injectIntl, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Grid, Image } from 'semantic-ui-react';
import moment from 'moment';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './Advanced.css';
import messages from './messages';

const DefaultImageSVG = React.lazy(() => import('./placeholder.png'));
const ResponsiveImage = React.lazy(() => import('./ResponsiveImage'));
const processItemsForRecurrence = React.lazy(() => import('./processItemsForRecurrence'));
const renderImage = React.lazy(() => import('./renderImage'));

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
                                       }) => {
  const intl = useIntl();
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: howManyColumns || 3,
    slidesToScroll: slidesToScroll || 1,
    autoplay: isPlaying,
    autoplaySpeed: autoplaySpeed || 5000, // Set a reasonable autoplay speed
  };

  const getEventDate = (item) => moment(item.start).format('L');
  const getEventTime = (item) => moment(item.start).format('LT');

  const imageGridWidth = imageWidth || 4;
  const textGridWidth = 16 - imageGridWidth;

  return (
    <div className='advanced-carousel-block'>
      <Suspense fallback={<div>Loading...</div>}>
        <Slider {...settings}>
          {items.map((item) => (
            <Grid key={item['@id']} className='carousel-item' stackable>
              {['left', 'up'].includes(imageSide) && (
                <Grid.Column width={imageGridWidth}>
                  <renderImage item={item} isEditMode={isEditMode} howManyColumns={howManyColumns} />
                </Grid.Column>
              )}
              <Grid.Column width={textGridWidth}>
                {showTitle && (
                  <header className={headerTag}>
                    <Link to={flattenToAppURL(item['@id'])}>
                      {item.title}
                    </Link>
                  </header>
                )}
                {eventDate && (
                  <div>
                    <span className='start-date'>{getEventDate(item)}</span>
                    {eventTime && eventDate && <span> | </span>}
                    {eventTime && (
                      <span className='start-time'>{getEventTime(item)}</span>
                    )}
                  </div>
                )}
                {eventLocation && <p>{item.location}</p>}
                {effectiveDate && <p>{moment(item.effective).format('L')}</p>}
                {expirationDate && (
                  <p>Expiration: {moment(item.expires).format('L')}</p>
                )}
                {showDescription && item.description && (
                  <p>{item.description}</p>
                )}
              </Grid.Column>
              {['right', 'down'].includes(imageSide) && (
                <Grid.Column width={imageGridWidth}>
                  <renderImage item={item} isEditMode={isEditMode} howManyColumns={howManyColumns} />
                </Grid.Column>
              )}
            </Grid>
          ))}
        </Slider>
        <button className='ui circular button playpause' onClick={togglePlay}>
          {isPlaying ? (
            <Image
              src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEgMjRoLTR2LTIwaDR2MjB6bTYtMjBoLTR2MjBoNHYtMjB6Ii8+PC9zdmc+'
              alt={intl.formatMessage(messages.pause)}
            />
          ) : (
            <Image
              src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAyMnYtMjBsMTggMTAtMTggMTB6Ii8+PC9zdmc+'
              alt={intl.formatMessage(messages.play)}
            />
          )}
        </button>
      </Suspense>
    </div>
  );
};

AdvancedCarouselBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default injectIntl(AdvancedCarouselBlockTemplate);
