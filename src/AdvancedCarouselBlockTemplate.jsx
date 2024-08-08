import React, { useState } from 'react';
import { injectIntl, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
import DefaultImageSVG from './placeholder.png';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { Grid, Image } from 'semantic-ui-react';
import moment from 'moment';
import Slider from 'react-slick';
import './Advanced.css';
import messages from './messages';
import ResponsiveImage from './ResponsiveImage';
import processItemsForRecurrence from './processItemsForRecurrence';
import renderImage from './renderImage';
import { Link } from 'react-router-dom';

//
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';


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
  let moreLink = null;
  let moreHref = moreLinkUrl?.[0]?.['@id'] || '';
  if (isInternalURL(moreHref)) {
    moreLink = (
      <Link to={flattenToAppURL(moreHref)} condition={!isEditMode}>
        {moreLinkText || moreHref}
      </Link>
    );
  } else if (moreHref) {
    moreLink = <a href={moreHref}>{moreLinkText || moreHref}</a>;
  }

  let headerLink = null;
  let headerHref = headerUrl?.[0]?.['@id'] || '';
  if (isInternalURL(headerHref)) {
    headerLink = (
      <Link to={flattenToAppURL(headerHref)} condition={!isEditMode}>
        {header || headerHref}
      </Link>
    );
  } else if (headerHref) {
    moreLink = <a href={headerHref}>{moreLinkText || headerHref}</a>;
  }
  const getEventCard = (item) => {
    let startMonth = '',
      startDay = '',
      startWeekday = '',
      startTime = '';
    if (item.start) {
      const parsedDate = new Date(Date.parse(item.start));
      startMonth = `${parsedDate.toLocaleString('default', {
        month: 'long',
      })}`;
      startDay = parsedDate.getDate();
      startWeekday = parsedDate.toLocaleString('default', {
        weekday: 'long',
      });
      return (
        <div class='cal_date'>
          <span class='cal_month'>{startMonth}</span>
          <span class='cal_day'>{startDay}</span>
          <span class='cal_wkday'>{startWeekday}</span>
        </div>
      );
    } else {
      return '';
    }
  };
  const getEventDate = (item) => {
    let start = '',
      end = '';

    if (item.start) {
      const parsedDate = new Date(Date.parse(item.start));
      start = `${parsedDate.toLocaleString('default', {
        month: 'short',
      })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
    }

    if (item.end) {
      const parsedDate = new Date(Date.parse(item.end));
      end = `${parsedDate.toLocaleString('default', {
        month: 'short',
      })} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
    }
    return end === start ? start : `${start} - ${end}`;
  };
  const getEventTime = (item) => {
    let start = '',
      end = '';

    if (item.start) {
      const parsedDate = new Date(Date.parse(item.start));
      start = `${parsedDate.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}`;
    }

    if (item.end) {
      const parsedDate = new Date(Date.parse(item.end));
      end = ` - ${parsedDate.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}`;
    }

    return start + end;
  };
  const hasImage = imageSide !== null;
  const oneColumnElement = ['up', 'down', 'background', null].includes(
    imageSide,
  );
  const columnSize = oneColumnElement ? 1 : 2;
  const imageGridWidth = oneColumnElement ? 12 : imageWidth ? imageWidth : 2;
  const contentGridWidth = oneColumnElement
    ? 12
    : hasImage
      ? 12 - imageWidth
      : 12;
  const intl = useIntl();
  const TitleTag = titleTag ? titleTag : 'h3';
  const HeaderTag = headerTag ? headerTag : 'h3';
  const AutoPlay = autoPlay ? autoPlay : 'True';
  const AutoPlaySpeed = autoplaySpeed ? autoplaySpeed : '3';
  const sliderRef = React.createRef();
  const refForwarder = (ref) => {
    sliderRef.current = ref;
  };
  const [isPlaying, setIsPlaying] = useState(true);
  const togglePlay = () => {
    if (isPlaying) {
      sliderRef.current.slickPause();
    } else {
      sliderRef.current.slickPlay();
    }
    setIsPlaying(!isPlaying);
  };

  // Process items for recurrence and future dates
  // const processedItems = processItemsForRecurrence(items);
  let processedItems = [];

  if (showRecurrence) {
    // Process items for recurrence and future dates if showRecurrence is true
    processedItems = processItemsForRecurrence(items);
  } else {
    // Simply push the original items into processedItems if showRecurrence is false
    processedItems = items.map((item) => ({
      title: item.title,
      start: item.start,
      end: item.end,
      url: flattenToAppURL(item['@id']),
      effective: item.effective,
      expires: item.expires,
      description: item.description,
      location: item.location,
      ['@id']: `${item['@id']}`,
      ['@type']: item['@type'],
      image_field: item.image_field,
    }));
  }

  moment.locale(intl.locale);
  return (
    <div className='advancedView'>
      {headerLink && (
        <HeaderTag className='listing-header'>
          {headerLink ? headerLink : header}
        </HeaderTag>
      )}

      <Slider
        ref={refForwarder}
        className={'column' + howManyColumns}
        dots={true}
        infinite={true}
        lazyLoad={true}
        speed={500}
        slidesToShow={howManyColumns ? howManyColumns : 1}
        slidesToScroll={slidesToScroll ? slidesToScroll : 1}
        autoplay={AutoPlay}
        autoplaySpeed={AutoPlaySpeed * 1000}
        pauseOnHover={false}
        arrows={true}
        responsive={
          howManyColumns >= 3
            ? [
              {
                breakpoint: 1169,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 991,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                },
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]
            : [
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]
        }
      >
        {['background'].includes(imageSide) &&
          processedItems.map((item, index) => (
            <div className='backgroundimage'>
              <Link to={item.url} condition={!isEditMode}>
                <div className='focuspoint'>
                  {!item.image_field && (
                    <Link to={item.url} condition={!isEditMode}>
                      <Image
                        className='listImage'
                        src={DefaultImageSVG}
                        alt={intl.formatMessage(messages.thisContentHasNoImage)}
                        size='small'
                      />
                    </Link>
                  )}
                  {item.image_field && (
                    <ResponsiveImage item={item} howManyColumns={howManyColumns} />
                  )}
                </div>
                <div className='info-text'>
                  {quote && (
                    <>
                      <blockquote>{item.description}</blockquote>
                      <div className='styled-slate right has--align--right align styled'>
                        {item.title ? item.title : item.id}
                      </div>
                    </>
                  )}
                  {eventCard && <>{getEventCard(item)}</>}
                  {(item.start && eventDate || eventTime && (
                      <span class='event-when'>
                      {eventDate && (
                        <span className='start-date'>{getEventDate(item)}</span>
                      )}
                        {eventTime && eventDate && <span> | </span>}
                        {eventTime && (
                          <span className='start-time'>
                          {getEventTime(item) === '12:00 AM - 11:59 PM' ? 'All Day' : getEventTime(item)}
                        </span>
                        )}
                    </span>
                    )) ||
                    null}
                  {showTitle && (
                    <TitleTag className='limited-text'>
                      {item.title ? item.title : item.id}
                    </TitleTag>
                  )}
                  <p>
                    {eventLocation && (
                      <span>
                        {item.location}
                        <br />
                      </span>
                    )}
                    {effectiveDate && (
                      <span>
                        {moment(item.effective).format('L')}
                        <br />
                      </span>
                    )}
                    {expirationDate && (
                      <span>
                            Expiration: {moment(item.expires).format('L')}
                        <br />
                          </span>
                    )}
                    {showDescription && item.description && (
                      <span className='limited-text'>{item.description}</span>
                    )}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        {!['background'].includes(imageSide) &&
          processedItems.map((item) => (
            <Grid columns={columnSize}>
              {['up', 'left'].includes(imageSide) && (
                <Grid.Column width={imageGridWidth} className='advanced-item'>
                  {renderImage(item, isEditMode, howManyColumns)}
                </Grid.Column>
              )}
              <Grid.Column width={contentGridWidth} verticalAlign='top'>
                {quote && (
                  <>
                    <blockquote>{item.description}</blockquote>
                    <div className='styled-slate right has--align--right align styled'>
                      {item.title ? item.title : item.id}
                    </div>
                  </>
                )}
                {eventCard && <>{getEventCard(item)}</>}
                {showTitle && (
                  <TitleTag>
                    <Link to={item.url} condition={!isEditMode}>
                      {item.title ? item.title : item.id}
                    </Link>
                  </TitleTag>
                )}
                {(item.location && eventDate || eventTime && (
                    <div className='event-when'>
                      {eventDate && (
                        <span className='start-date'>{getEventDate(item)}</span>
                      )}
                      {eventTime && eventDate && <span> | </span>}
                      {eventTime && (
                        <span className='start-time'>{getEventTime(item)}</span>
                      )}
                    </div>
                  )) ||
                  null}
                {eventLocation && <p>{item.location}</p>}
                {effectiveDate && <p>{moment(item.effective).format('L')}</p>}
                {expirationDate && <p>Expiration: {moment(item.expires).format('L')}</p>}
                {showDescription && item.description && (
                  <p>{item.description}</p>
                )}
              </Grid.Column>
              {['right', 'down'].includes(imageSide) && (
                <Grid.Column width={imageGridWidth}>
                  {renderImage(item, isEditMode, howManyColumns)}
                </Grid.Column>
              )}
            </Grid>
          ))}
      </Slider>
      <button className='ui circular button playpause' onClick={togglePlay}>
        {isPlaying ? (
          <Image
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEgMjJoLTR2LTIwaDR2MjB6bTYtMjBoLTR2MjBoNHYtMjB6Ii8+PC9zdmc+'
            alt={intl.formatMessage(messages.pause)}
          />
        ) : (
          <Image
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyAyMnYtMjBsMTggMTAtMTggMTB6Ii8+PC9zdmc+'
            alt={intl.formatMessage(messages.play)}
          />
        )}
      </button>
    </div>
  );
};

AdvancedCarouselBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default injectIntl(AdvancedCarouselBlockTemplate);
