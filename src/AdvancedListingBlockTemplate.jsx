import React from 'react';
import PropTypes from 'prop-types';
import { ConditionalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import DefaultImageSVG from './placeholder.png';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { Grid, Image } from 'semantic-ui-react';
import moment from 'moment';
import { injectIntl, useIntl } from 'react-intl';
import messages from './messages';
import ResponsiveImage from './ResponsiveImage';
import { RRule, rrulestr } from 'rrule';

const renderImage = (item, isEditMode, howManyColumns) => {
  const intl = useIntl();

  if (!item.image_field) {
    return (
      <ConditionalLink item={item} condition={!isEditMode}>
        <Image
          className='listImage'
          src={DefaultImageSVG}
          alt={intl.formatMessage(messages.thisContentHasNoImage)}
          size='small'
        />
      </ConditionalLink>
    );
  }

  return (
    <ConditionalLink item={item} condition={!isEditMode}>
      <ResponsiveImage item={item} howManyColumns={howManyColumns} />
    </ConditionalLink>
  );
};

const processItemsForRecurrence = (originalItems) => {
  const today = new Date();
  const newItems = [];

  originalItems.forEach((item) => {
    if (item.recurrence && item.recurrence.startsWith('DTSTART')) {
      let recurrence = item.recurrence;
      if (item.recurrence.indexOf('DTSTART') < 0) {
        var dtstart = RRule.optionsToString({
          dtstart: new Date(item.start),
        });
        recurrence = dtstart + '\n' + recurrence;
      }

      const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

      rrule.all().forEach((date) => {
        let futureDate = new Date(date);
        let dateStr = `${futureDate.getFullYear()}-${(futureDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${futureDate.getDate().toString().padStart(2, '0')}`;
        let startStr = dateStr + item.start.slice(10);
        let endStr = dateStr + item.end.slice(10);

        // Only push if the date is in the future
        if (futureDate > today) {
          newItems.push({
            title: item.title,
            start: startStr,
            end: endStr,
            url: flattenToAppURL(item['@id']),
            groupId: item['@id'],
            effective: item.effective,
            expires: item.expires,
            description: item.description,
            location: item.location,
            id: item['@id'],
            type: item['@type'],
          });
        }
      });
    } else {
      newItems.push(item);
    }
  });

  // Sort items by 'start'
  newItems.sort((a, b) => new Date(a.start) - new Date(b.start));

  return newItems;
};


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
                                      }) => {
  let moreLink = null;
  let moreHref = moreLinkUrl?.[0]?.['@id'] || '';
  if (isInternalURL(moreHref)) {
    moreLink = (
      <ConditionalLink to={flattenToAppURL(moreHref)} condition={!isEditMode}>
        {moreLinkText || moreHref}
      </ConditionalLink>
    );
  } else if (moreHref) {
    moreLink = <a href={moreHref}>{moreLinkText || moreHref}</a>;
  }

  let headerLink = null;
  let headerHref = headerUrl?.[0]?.['@id'] || '';
  if (isInternalURL(headerHref)) {
    headerLink = (
      <ConditionalLink to={flattenToAppURL(headerHref)} condition={!isEditMode}>
        {header || headerHref}
      </ConditionalLink>
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
      if (item.recurrence && item.recurrence.startsWith('DTSTART')) {
        return (
          <div className='cal_date'>
            <span className='cal_month'>Recurring</span>
            <span className='cal_day'>Event</span>
            <span className='cal_wkday'>&nbsp;</span>
          </div>
        );
      } else {
        const parsedDate = new Date(Date.parse(item.start));
        startMonth = `${parsedDate.toLocaleString('default', {
          month: 'long',
        })}`;
        startDay = parsedDate.getDate();
        startWeekday = parsedDate.toLocaleString('default', {
          weekday: 'long',
        });
        return (
          <div className='cal_date'>
            <span className='cal_month'>{startMonth}</span>
            <span className='cal_day'>{startDay}</span>
            <span className='cal_wkday'>{startWeekday}</span>
          </div>
        );
      }
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

  // Process items for recurrence and future dates
  const processedItems = processItemsForRecurrence(items);

  moment.locale(intl.locale);
  return (
    <div className='advancedView advancedList'>
      {headerLink && (
        <HeaderTag className='listing-header'>
          {headerLink ? headerLink : header}
        </HeaderTag>
      )}
      <Grid
        columns={howManyColumns ? howManyColumns : 1}
        stackable
        className={'column' + howManyColumns}
      >
        {!['background'].includes(imageSide) &&
          processedItems.map((item) => (
            <Grid columns={columnSize} className='advanced-item'>
              {['up', 'left'].includes(imageSide) && (
                <Grid.Column width={imageGridWidth}>
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
                    <ConditionalLink item={item} condition={!isEditMode}>
                      {item.title ? item.title : item.id}
                    </ConditionalLink>
                  </TitleTag>
                )}
                {(item.start && eventDate || eventTime && (
                    <p className='event-when'>
                      {eventDate && (
                        <span className='start-date'>{getEventDate(item)}</span>
                      )}
                      {eventTime && eventDate && <span> | </span>}
                      {eventTime && (
                        <span className='start-time'>{getEventTime(item)}</span>
                      )}
                    </p>
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
        {['background'].includes(imageSide) &&
          processedItems.map((item) => (
            <Grid columns={columnSize} className='advanced-item'>
              <Grid.Column>
                <div className='backgroundimage'>
                  <ConditionalLink item={item} condition={!isEditMode}>
                    <div className='focuspoint'>
                      {!item.image_field && (
                        <ConditionalLink item={item} condition={!isEditMode}>
                          <Image
                            className='listImage'
                            src={DefaultImageSVG}
                            alt={intl.formatMessage(
                              messages.thisContentHasNoImage,
                            )}
                            size='small'
                          />
                        </ConditionalLink>
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
                      {(item.location && eventDate | eventTime && (
                          <span class='event-when'>
                          {eventDate && (
                            <span className='start-date'>
                              {getEventDate(item)}
                            </span>
                          )}
                            {eventTime && eventDate && <span> | </span>}
                            {eventTime && (
                              <span className='start-time'>
                              {getEventTime(item)}
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
                          <span className='limited-text'>
                            {item.description}
                          </span>
                        )}
                      </p>
                    </div>
                  </ConditionalLink>
                </div>
              </Grid.Column>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

AdvancedListingBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default injectIntl(AdvancedListingBlockTemplate);
