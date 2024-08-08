import React, { Suspense } from 'react';
import { injectIntl, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import moment from 'moment';
import Slider from 'react-slick';
import './Advanced.css';
import renderImage from './renderImage';
import { Link } from 'react-router-dom';

const ResponsiveImage = React.lazy(() => import('./ResponsiveImage'));

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

  const settings = {
    slidesToShow: howManyColumns,
    slidesToScroll: slidesToScroll,
    autoplay: autoPlay,
    autoplaySpeed: autoplaySpeed,
  };

  return (
    <div className='advanced-carousel-block'>
      {header && (
        <header className='header'>
          {headerUrl ? (
            <Link to={headerUrl}>
              <h2 className={`header-title ${headerTag}`}>{header}</h2>
            </Link>
          ) : (
            <h2 className={`header-title ${headerTag}`}>{header}</h2>
          )}
        </header>
      )}
      <Slider {...settings}>
        {items.map((item, index) => {
          const url = flattenToAppURL(item.url);
          const image = renderImage(item.image, imageWidth);
          const isInternal = isInternalURL(url);
          const target = isInternal ? '_self' : '_blank';

          return (
            <div key={index} className='carousel-item'>
              <Suspense fallback={<div>Loading...</div>}>
                <ResponsiveImage image={image} alt={item.title || ' '} />
              </Suspense>
              {showTitle && <h3>{item.title}</h3>}
              {showDescription && <p>{item.description}</p>}
              {eventDate && (
                <div className='event-date'>
                  {moment(item.start).format('MMM DD, YYYY')}
                </div>
              )}
              {eventLocation && <div className='event-location'>{item.location}</div>}
              {eventTime && (
                <div className='event-time'>{moment(item.start).format('h:mm A')}</div>
              )}
              {moreLinkUrl && (
                <Link to={moreLinkUrl} target={target} className='more-link'>
                  {moreLinkText}
                </Link>
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

AdvancedCarouselBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  moreLinkText: PropTypes.string,
  moreLinkUrl: PropTypes.string,
  header: PropTypes.string,
  headerUrl: PropTypes.string,
  headerTag: PropTypes.string,
  isEditMode: PropTypes.bool,
  imageSide: PropTypes.string,
  imageWidth: PropTypes.string,
  howManyColumns: PropTypes.number,
  effectiveDate: PropTypes.string,
  expirationDate: PropTypes.string,
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
};

AdvancedCarouselBlockTemplate.defaultProps = {
  moreLinkText: '',
  moreLinkUrl: '',
  header: '',
  headerUrl: '',
  headerTag: 'h2',
  isEditMode: false,
  imageSide: 'left',
  imageWidth: '100%',
  howManyColumns: 1,
  effectiveDate: '',
  expirationDate: '',
  titleTag: 'h3',
  showTitle: true,
  showDescription: true,
  eventDate: false,
  eventLocation: false,
  eventTime: false,
  slidesToScroll: 1,
  autoPlay: false,
  autoplaySpeed: 3000,
  eventCard: false,
};

export default injectIntl(AdvancedCarouselBlockTemplate);
