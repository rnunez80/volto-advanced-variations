import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { getEventDate, getEventTime } from './sharedUtils';
import processItemsForRecurrence from './processItemsForRecurrence';
import './Advanced.css';

const AdvancedTableBlockTemplate = ({
  items,
  moreLinkText,
  moreLinkUrl,
  header,
  headerUrl,
  headerTag: HeaderTag = 'h2',
  isEditMode,
  effectiveDate,
  expirationDate,
  titleTag,
  showDescription,
  eventDate,
  eventLocation,
  eventTime,
  showTitle,
  showRecurrence,
  creatorauthor,
}) => {
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

  const columnHeaders = [
    { key: 'title', label: 'Title', visible: showTitle },
    { key: 'description', label: 'Description', visible: showDescription },
    { key: 'effectiveDate', label: 'Effective Date', visible: effectiveDate },
    { key: 'expirationDate', label: 'Expiration Date', visible: expirationDate },
    { key: 'eventDate', label: 'Date', visible: eventDate },
    { key: 'eventTime', label: 'Time', visible: eventTime },
    { key: 'eventLocation', label: 'Location', visible: eventLocation },
    { key: 'creatorauthor', label: 'Author', visible: creatorauthor },
  ];

  const visibleColumns = columnHeaders.filter(col => col.visible);

  const getCellContent = (item, key) => {
    let content;
    switch (key) {
      case 'title':
        content = (
          <titleTag className='threelines'>
            {!isEditMode ? (
              <Link to={item.url}>{item.title ? item.title : item.id}</Link>
            ) : (
              item.title || item.id
            )}
          </titleTag>
        );
        break;
      case 'description':
        content = showDescription && item.description && <span>{item.description}</span>;
        break;
      case 'effectiveDate':
        content = effectiveDate && <span>{new Date(item.effective).toLocaleDateString()}</span>;
        break;
      case 'expirationDate':
        content = expirationDate && <span>Expiration: {new Date(item.expires).toLocaleDateString()}</span>;
        break;
      case 'eventDate':
        content = eventDate && getEventDate(item);
        break;
      case 'eventTime':
        content = eventTime && getEventTime(item) === '12:00 AM - 11:59 PM' ? 'All Day' : getEventTime(item);
        break;
      case 'eventLocation':
        content = eventLocation && item.location;
        break;
      case 'creatorauthor':
        content = creatorauthor && <p className='author'>{item.Creator}</p>;
        break;
      default:
        content = null;
    }
    return content;
  };

  const renderHeaderCell = (col, index) => (
    <th key={index} className='advanced-table-header'>
      {col.label}
    </th>
  );

  const renderBodyCell = (item, col, colIndex) => {
    const content = getCellContent(item, col.key);
    return (
      <td key={colIndex} className='advanced-table-cell'>
        {content}
      </td>
    );
  };

  return (
    <div className='ui twelve column grid advanced-table'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
      <table className='ui celled table'>
        <thead>
          <tr>
            {visibleColumns.map(renderHeaderCell)}
          </tr>
        </thead>
        <tbody>
          {processedItems.map((item, index) => (
            <tr key={item['@id']}>
              {visibleColumns.map((col, colIndex) =>
                renderBodyCell(item, col, colIndex),
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {moreLink && <div className='more-link'>{moreLink}</div>}
    </div>
  );
};

AdvancedTableBlockTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  moreLinkText: PropTypes.string,
  moreLinkUrl: PropTypes.array,
  header: PropTypes.string,
  headerUrl: PropTypes.array,
  headerTag: PropTypes.string,
  isEditMode: PropTypes.bool,
  effectiveDate: PropTypes.bool,
  expirationDate: PropTypes.bool,
  titleTag: PropTypes.string,
  showDescription: PropTypes.bool,
  eventDate: PropTypes.bool,
  eventLocation: PropTypes.bool,
  eventTime: PropTypes.bool,
  showTitle: PropTypes.bool,
  showRecurrence: PropTypes.bool,
  creatorauthor: PropTypes.bool,
};

export default React.memo(AdvancedTableBlockTemplate);
