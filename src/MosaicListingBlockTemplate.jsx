import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import moment from 'moment';
import { FadeInSection, getEventDate } from './sharedUtils';
import './MosaicListing.css';

const COLOR_COMBOS = [
  { bg: '#B11116', text: '#FFE293' },
  { bg: '#1D3A83', text: '#59CBE8' },
  { bg: '#8363AA', text: '#ffffff' },
  { bg: '#C4D600', text: '#1D3A83' },
  { bg: '#FFB81C', text: '#1D3A83' },
  { bg: '#59CBE8', text: '#1D3A83' },
  { bg: '#1D3A83', text: '#C4D600' },
];

// All backgrounds are dark — buttons are always white border + white text.
// On hover, CSS fills button with white and sets text to the card bg.
const BTN_VARS = { '--btn-color': '#ffffff', '--btn-border-color': '#ffffff' };

// Split flat items array into bento groups of 3 [large, small, small]
const groupIntoBento = (items) => {
  const groups = [];
  let i = 0;
  while (i < items.length) {
    const remaining = items.length - i;
    if (remaining === 1) {
      // Single item – render as large
      groups.push({ large: items[i], smalls: [] });
      i += 1;
    } else if (remaining === 2) {
      // Two items – large + one small
      groups.push({ large: items[i], smalls: [items[i + 1]] });
      i += 2;
    } else {
      // Normal group of 3
      groups.push({ large: items[i], smalls: [items[i + 1], items[i + 2]] });
      i += 3;
    }
  }
  return groups;
};

const MosaicListingBlockTemplate = ({
  items,
  moreLinkText,
  moreLinkUrl,
  header,
  headerUrl,
  headerTag: HeaderTag = 'h2',
  isEditMode,
  titleTag,
  showDescription = true,
  fetchPriority = 'auto',
  readMore = true,
  enableAnimation,
  effectiveDate,
  expirationDate,
  showStartDate,
  imageField = 'image',
}) => {
  const processedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      url: flattenToAppURL(item['@id']),
    }));
  }, [items]);

  const bentoGroups = useMemo(
    () => groupIntoBento(processedItems),
    [processedItems],
  );

  const getLink = (url, text) => {
    if (!url) return null;
    return isInternalURL(url) ? (
      <Link to={flattenToAppURL(url)}>{text || url}</Link>
    ) : (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {text || url}
      </a>
    );
  };

  const moreLink = getLink(moreLinkUrl?.[0]?.['@id'], moreLinkText);
  const headerLink = getLink(headerUrl?.[0]?.['@id'], header);
  const TitleTag = titleTag || 'h3';

  const getImageSrc = (item, size) => {
    const fieldToUse = item.image_field || imageField;
    if (item.preview_image_url) {
      return item.preview_image_url;
    }
    return `${item.url}/@@images/${fieldToUse}/${size}`;
  };

  // Color rotation: pick next combo that is NOT the same bg as the previous one.
  // Returns a combo object for a sequential item index.
  let _lastBg = null;
  let _colorCursor = 0;
  const nextCombo = () => {
    let combo = COLOR_COMBOS[_colorCursor % COLOR_COMBOS.length];
    // Skip if same bg as previous (cycle forward until different)
    if (combo.bg === _lastBg && COLOR_COMBOS.length > 1) {
      _colorCursor++;
      combo = COLOR_COMBOS[_colorCursor % COLOR_COMBOS.length];
    }
    _lastBg = combo.bg;
    _colorCursor++;
    return combo;
  };

  const renderLargeCard = (item, combo, globalItemIdx) => {
    const imageSrc = getImageSrc(item, 'large');
    const readMoreLabel = `Read more about ${item.title || item.id}`;
    const ariaId = `mosaic-title-${globalItemIdx}`;
    const fieldToUse = item.image_field || imageField;

    const card = (
      <article
        className="mosaic-card mosaic-card--large"
        style={{ '--card-bg': combo.bg, '--card-text': combo.text }}
        aria-labelledby={ariaId}
      >
        {/* Image — top */}
        <div className="mosaic-card__image-wrap" aria-hidden="true">
          {imageSrc ? (
            <img
              src={imageSrc}
              srcSet={[
                `${item.url}/@@images/${fieldToUse}/preview 400w`,
                `${item.url}/@@images/${fieldToUse}/teaser 600w`,
                `${item.url}/@@images/${fieldToUse}/large 900w`,
                `${item.url}/@@images/${fieldToUse}/larger 1200w`,
              ].join(',')}
              sizes="(max-width: 767px) 100vw, 50vw"
              alt={item.title || ''}
              className="mosaic-card__image"
              loading={
                fetchPriority === 'high' && globalItemIdx === 0
                  ? 'eager'
                  : 'lazy'
              }
              fetchpriority={
                globalItemIdx === 0 ? fetchPriority || 'auto' : 'auto'
              }
            />
          ) : (
            <div
              className="mosaic-card__image--placeholder"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Panel */}
        <div
          className="mosaic-card__panel"
          style={{ backgroundColor: combo.bg }}
        >
          <TitleTag
            id={ariaId}
            className="mosaic-card__title"
            style={{ color: combo.text }}
          >
            {isEditMode ? (
              item.title || item.id
            ) : (
              <Link
                to={item.url}
                aria-label={item.title || item.id}
                className="mosaic-card__title-link"
                style={{ color: 'inherit' }}
              >
                {item.title || item.id}
              </Link>
            )}
          </TitleTag>

          {/* Date metadata */}
          {(effectiveDate || expirationDate || showStartDate) && (
            <p className="mosaic-card__dates" style={{ color: combo.text }}>
              {showStartDate && item.start && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Start: </span>
                  {getEventDate(item)}
                </span>
              )}
              {effectiveDate && item.effective && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Published: </span>
                  {moment(item.effective).format('MMM D, YYYY')}
                </span>
              )}
              {expirationDate && item.expires && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Expires: </span>
                  {moment(item.expires).format('MMM D, YYYY')}
                </span>
              )}
            </p>
          )}

          {showDescription && item.description && (
            <p className="mosaic-card__description">{item.description}</p>
          )}

          {readMore && (
            <div className="">
              {isEditMode ? (
                <span className="ui white button" aria-hidden="true">
                  Read More
                </span>
              ) : isInternalURL(item.url) ? (
                <Link
                  to={item.url}
                  className="ui white button"
                  aria-label={readMoreLabel}
                >
                  Read More
                </Link>
              ) : (
                <a
                  href={item.url}
                  className="ui white button"
                  aria-label={readMoreLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    );

    return enableAnimation ? (
      <FadeInSection delay={globalItemIdx * 80}>{card}</FadeInSection>
    ) : (
      card
    );
  };

  const renderSmallCard = (item, combo, globalItemIdx) => {
    const imageSrc = getImageSrc(item, 'preview');
    const readMoreLabel = `Read more about ${item.title || item.id}`;
    const ariaId = `mosaic-title-${globalItemIdx}`;
    const fieldToUse = item.image_field || imageField;

    const card = (
      <article
        className="mosaic-card mosaic-card--small"
        style={{ '--card-bg': combo.bg, '--card-text': combo.text }}
        aria-labelledby={ariaId}
      >
        {/* Image — left side */}
        {imageSrc ? (
          <div
            className="mosaic-card__image-wrap mosaic-card__image-wrap--side"
            aria-hidden="true"
          >
            <img
              src={imageSrc}
              srcSet={[
                `${item.url}/@@images/${fieldToUse}/mini 200w`,
                `${item.url}/@@images/${fieldToUse}/preview 400w`,
                `${item.url}/@@images/${fieldToUse}/teaser 600w`,
              ].join(',')}
              sizes="(max-width: 767px) 100vw, 25vw"
              alt={item.title || ''}
              className="mosaic-card__image"
              loading="lazy"
              fetchpriority="auto"
            />
          </div>
        ) : (
          <div
            className="mosaic-card__image-wrap mosaic-card__image-wrap--side mosaic-card__image--placeholder"
            aria-hidden="true"
          />
        )}

        {/* Panel — right side */}
        <div
          className="mosaic-card__panel mosaic-card__panel--side"
          style={{ backgroundColor: combo.bg }}
        >
          <TitleTag
            id={ariaId}
            className="mosaic-card__title mosaic-card__title--small"
            style={{ color: combo.text }}
          >
            {isEditMode ? (
              item.title || item.id
            ) : (
              <Link
                to={item.url}
                aria-label={item.title || item.id}
                className="mosaic-card__title-link"
                style={{ color: 'inherit' }}
              >
                {item.title || item.id}
              </Link>
            )}
          </TitleTag>

          {/* Date metadata */}
          {(effectiveDate || expirationDate || showStartDate) && (
            <p className="mosaic-card__dates" style={{ color: combo.text }}>
              {showStartDate && item.start && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Start: </span>
                  {getEventDate(item)}
                </span>
              )}
              {effectiveDate && item.effective && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Published: </span>
                  {moment(item.effective).format('MMM D, YYYY')}
                </span>
              )}
              {expirationDate && item.expires && (
                <span className="mosaic-card__date">
                  <span className="mosaic-card__date-label">Expires: </span>
                  {moment(item.expires).format('MMM D, YYYY')}
                </span>
              )}
            </p>
          )}

          {showDescription && item.description && (
            <p className="mosaic-card__description mosaic-card__description--small">
              {item.description}
            </p>
          )}

          {readMore && (
            <div className="mosaic-card__cta">
              {isEditMode ? (
                <span className="ui white button" aria-hidden="true">
                  Read More
                </span>
              ) : isInternalURL(item.url) ? (
                <Link
                  to={item.url}
                  className="ui white button"
                  aria-label={readMoreLabel}
                >
                  Read More
                </Link>
              ) : (
                <a
                  href={item.url}
                  className="ui white button"
                  aria-label={readMoreLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    );

    return enableAnimation ? (
      <FadeInSection delay={globalItemIdx * 80}>{card}</FadeInSection>
    ) : (
      card
    );
  };

  if (!processedItems || processedItems.length === 0) return null;

  return (
    <section
      className="mosaic-listing"
      aria-label={header || 'Featured articles'}
    >
      {headerLink && (
        <HeaderTag className="mosaic-listing__header">{headerLink}</HeaderTag>
      )}
      {!headerLink && header && (
        <HeaderTag className="mosaic-listing__header">{header}</HeaderTag>
      )}

      <ul className="mosaic-bento" role="list">
        {bentoGroups.map((group, groupIdx) => {
          // Alternate: even groups → large on left, odd → large on right
          const largeOnRight = groupIdx % 2 === 1;
          // nextCombo() advances global cursor & skips consecutive same-bg
          const largeCombo = nextCombo();
          const smallCombos = group.smalls.map(() => nextCombo());
          const largeIdx = groupIdx * 3;

          const largeCard = (
            <li className="mosaic-bento__large" key={group.large['@id']}>
              {renderLargeCard(group.large, largeCombo, largeIdx)}
            </li>
          );

          const smallStack =
            group.smalls.length > 0 ? (
              <li
                className="mosaic-bento__small-stack"
                key={`stack-${groupIdx}`}
                aria-label="Related articles"
              >
                <ul className="mosaic-bento__smalls" role="list">
                  {group.smalls.map((item, si) => (
                    <li key={item['@id']} className="mosaic-bento__small-item">
                      {renderSmallCard(
                        item,
                        smallCombos[si],
                        largeIdx + si + 1,
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ) : null;

          return (
            <li
              key={`group-${groupIdx}`}
              className={`mosaic-bento__group ${
                largeOnRight ? 'mosaic-bento__group--reversed' : ''
              }`}
            >
              <ul className="mosaic-bento__group-inner" role="list">
                {largeOnRight
                  ? [smallStack, largeCard]
                  : [largeCard, smallStack]}
              </ul>
            </li>
          );
        })}
      </ul>

      {moreLink && <div className="mosaic-listing__more-link">{moreLink}</div>}
    </section>
  );
};

MosaicListingBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  moreLinkText: PropTypes.string,
  moreLinkUrl: PropTypes.array,
  header: PropTypes.string,
  headerUrl: PropTypes.array,
  headerTag: PropTypes.string,
  isEditMode: PropTypes.bool,
  titleTag: PropTypes.string,
  showDescription: PropTypes.bool,
  fetchPriority: PropTypes.string,
  readMore: PropTypes.bool,
  enableAnimation: PropTypes.bool,
  effectiveDate: PropTypes.bool,
  expirationDate: PropTypes.bool,
  showStartDate: PropTypes.bool,
  imageField: PropTypes.string,
};

export default React.memo(MosaicListingBlockTemplate);
