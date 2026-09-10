import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';
import { getEventDate, getEventTime } from './sharedUtils';
import processItemsForRecurrence from './processItemsForRecurrence';
import './Advanced.css';

const createVttDataUri = (transcript) => {
  let text = '';
  if (transcript) {
    text = typeof transcript === 'string' ? transcript : (transcript.data || '');
  }
  let vtt = text;
  if (typeof window !== 'undefined' && text) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = text;
    text = (tmp.textContent || tmp.innerText || "").trim();
    vtt = text;
  }
  if (!vtt.startsWith('WEBVTT')) {
     vtt = `WEBVTT\n\n00:00:00.000 --> 99:59:59.999\n${vtt}`;
  }
  return `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
};

const AdvancedTableBlockTemplate = ({
  items = [],
  moreLinkText,
  moreLinkUrl,
  header,
  headerUrl,
  headerTag: HeaderTag = 'p',
  isEditMode,
  effectiveDate,
  expirationDate,
  titleTag = 'p',
  showDescription,
  eventDate,
  eventLocation,
  eventTime,
  showTitle,
  showRecurrence,
  creatorauthor,
  showAudio,
  infiniteScroll = false,
  rowsToShow = 5,
  pauseLength = 5,
  pauseDuration = 5,
}) => {
  const TitleTag = titleTag || 'h3';

  const processedItems = useMemo(() => {
    return showRecurrence
      ? processItemsForRecurrence(items)
      : items.map(item => ({
        ...item,
        url: flattenToAppURL(item['@id']),
      }));
  }, [items, showRecurrence]);

  const parsedRowsToShow = Math.max(1, parseInt(rowsToShow, 10) || 5);
  const shouldScroll = Boolean(infiniteScroll) && processedItems.length > parsedRowsToShow;
  const effectivePauseLength = pauseLength ?? pauseDuration ?? 5;
  const pauseDurationMs = (Math.max(1, parseInt(effectivePauseLength, 10)) || 5) * 1000;

  const containerRef = useRef(null);
  const tbodyRef = useRef(null);
  const firstSetHeightRef = useRef(0);
  const rowOffsetsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const touchStartY = useRef(null);
  const [containerHeight, setContainerHeight] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const isPaused = isHovered || isManualPaused;

  const calculateHeights = useCallback(() => {
    if (!containerRef.current || !tbodyRef.current) return;
    const rows = tbodyRef.current.querySelectorAll('tr[data-row-index]');
    if (!rows || rows.length === 0) return;

    const thead = containerRef.current.querySelector('thead');
    const theadHeight = thead ? thead.getBoundingClientRect().height : 0;

    const count = Math.min(parsedRowsToShow, rows.length);
    const tbodyTop = tbodyRef.current.getBoundingClientRect().top;

    const offsets = [];
    let totalFirstSet = 0;
    let maxWindowHeight = 0;

    rows.forEach(row => {
      const rect = row.getBoundingClientRect();
      offsets.push(rect.top - tbodyTop);
      totalFirstSet += rect.height;
    });

    for (let i = 0; i < rows.length; i++) {
      let windowHeight = 0;
      for (let j = 0; j < count; j++) {
        const rIdx = (i + j) % rows.length;
        windowHeight += rows[rIdx].getBoundingClientRect().height;
      }
      if (windowHeight > maxWindowHeight) {
        maxWindowHeight = windowHeight;
      }
    }

    rowOffsetsRef.current = offsets;
    firstSetHeightRef.current = totalFirstSet;
    setContainerHeight(Math.ceil(theadHeight + maxWindowHeight));
  }, [parsedRowsToShow]);

  const scrollToRow = useCallback(targetIndex => {
    if (!containerRef.current || !tbodyRef.current) return;
    const offsets = rowOffsetsRef.current;
    if (!offsets || offsets.length === 0) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const totalRows = offsets.length;
    const isWrapping = targetIndex >= totalRows;
    const targetScrollTop = isWrapping
      ? firstSetHeightRef.current
      : offsets[targetIndex] || 0;
    const startScrollTop = containerRef.current.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const duration = 600; // 0.6s smooth transition
    let startTime = null;
    isAnimatingRef.current = true;

    const animateScroll = currentTime => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeInOutCubic for smooth movement
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      if (containerRef.current) {
        containerRef.current.scrollTop = startScrollTop + distance * ease;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        isAnimatingRef.current = false;
        if (isWrapping && containerRef.current) {
          containerRef.current.scrollTop = 0;
          currentIndexRef.current = 0;
        } else {
          currentIndexRef.current = targetIndex;
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);

  const updateCurrentIndexFromScroll = useCallback(() => {
    if (!containerRef.current || !rowOffsetsRef.current.length) return;
    const currentScroll = containerRef.current.scrollTop;
    const offsets = rowOffsetsRef.current;
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < offsets.length; i++) {
      const diff = Math.abs(currentScroll - offsets[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    currentIndexRef.current = closestIndex;
  }, []);

  useEffect(() => {
    if (!shouldScroll) {
      setContainerHeight(null);
      return;
    }

    calculateHeights();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && tbodyRef.current) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeights();
      });
      resizeObserver.observe(tbodyRef.current);
    }

    const handleResize = () => {
      calculateHeights();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldScroll, calculateHeights]);

  // Pause on each row for pauseDurationMs (default 5 sec), then smoothly advance to the next row
  useEffect(() => {
    if (!shouldScroll) return;

    let timer = null;

    if (!isPaused) {
      timer = setInterval(() => {
        if (!isAnimatingRef.current) {
          const nextIndex = currentIndexRef.current + 1;
          scrollToRow(nextIndex);
        }
      }, pauseDurationMs);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldScroll, isPaused, pauseDurationMs, scrollToRow]);

  const handleWheel = e => {
    if (!containerRef.current || !firstSetHeightRef.current || !shouldScroll)
      return;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = false;
    }
    containerRef.current.scrollTop += e.deltaY;
    if (containerRef.current.scrollTop >= firstSetHeightRef.current) {
      containerRef.current.scrollTop -= firstSetHeightRef.current;
    } else if (containerRef.current.scrollTop < 0) {
      containerRef.current.scrollTop += firstSetHeightRef.current;
    }
    updateCurrentIndexFromScroll();
  };

  const handleTouchStart = e => {
    if (!shouldScroll) return;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = false;
    }
    touchStartY.current = e.touches[0].clientY;
    setIsHovered(true);
  };

  const handleTouchMove = e => {
    if (
      !shouldScroll ||
      touchStartY.current === null ||
      !containerRef.current ||
      !firstSetHeightRef.current
    )
      return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    touchStartY.current = currentY;
    containerRef.current.scrollTop += diff;
    if (containerRef.current.scrollTop >= firstSetHeightRef.current) {
      containerRef.current.scrollTop -= firstSetHeightRef.current;
    } else if (containerRef.current.scrollTop < 0) {
      containerRef.current.scrollTop += firstSetHeightRef.current;
    }
    updateCurrentIndexFromScroll();
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    setIsHovered(false);
  };

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
    { key: 'audio', label: 'Audio', visible: showAudio },
  ];

  const visibleColumns = columnHeaders.filter(col => col.visible);

  const getCellContent = (item, key, isDuplicate = false) => {
    let content;
    switch (key) {
      case 'title':
        content = (
          <strong className='threelines'>
            {!isEditMode ? (
              <Link to={item.url} tabIndex={isDuplicate ? -1 : undefined}>
                {item.title ? item.title : item.id}
              </Link>
            ) : (
              item.title || item.id
            )}
          </strong>
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
        content = eventTime && (getEventTime(item) === '12:00 AM - 11:59 PM' ? 'All Day' : getEventTime(item));
        break;
      case 'eventLocation':
        content = eventLocation && item.location;
        break;
      case 'creatorauthor':
        content = creatorauthor && <p className='author'>{item.Creator}</p>;
        break;
      case 'audio':
        content = showAudio && (
          <div className='audio-player-block'>
            <audio
              controls
              style={{ width: '100%' }}
              aria-label={item.title || 'Audio player'}
              tabIndex={isDuplicate ? -1 : undefined}
            >
              <source src={`${flattenToAppURL(item['@id'])}/@@download/file`} />
              <track kind="captions" src={createVttDataUri(item.audio_transcript)} srcLang="en" label="English" default />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
        break;
      default:
        content = null;
    }
    return content;
  };

  const renderHeaderCell = (col, index) => (
    <th key={index} className='advanced-table-header' scope='col'>
      {col.label}
    </th>
  );

  const renderBodyCell = (item, col, colIndex, isDuplicate = false) => {
    const content = getCellContent(item, col.key, isDuplicate);
    return (
      <td key={colIndex} className='advanced-table-cell'>
        {content}
      </td>
    );
  };

  const renderTable = () => (
    <table className={`ui celled table ${shouldScroll ? 'advanced-table-scrolling' : ''}`}>
      <thead>
        <tr>
          {visibleColumns.map(renderHeaderCell)}
        </tr>
      </thead>
      <tbody ref={shouldScroll ? tbodyRef : undefined}>
        {processedItems.map((item, index) => (
          <tr key={`orig-${item['@id'] || index}`} data-row-index={index}>
            {visibleColumns.map((col, colIndex) =>
              renderBodyCell(item, col, colIndex, false),
            )}
          </tr>
        ))}
        {shouldScroll &&
          processedItems.map((item, index) => (
            <tr
              key={`dup-${item['@id'] || index}`}
              aria-hidden="true"
              className="advanced-table-dup-row"
            >
              {visibleColumns.map((col, colIndex) =>
                renderBodyCell(item, col, colIndex, true),
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <div className='ui twelve column grid advanced-table'>
      {headerLink && <HeaderTag className='listing-header'>{headerLink}</HeaderTag>}
      {shouldScroll ? (
        <div
          ref={containerRef}
          className='advanced-table-scroll-wrapper'
          style={
            containerHeight
              ? { height: `${containerHeight}px`, maxHeight: `${containerHeight}px` }
              : undefined
          }
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderTable()}
        </div>
      ) : (
        renderTable()
      )}

      {shouldScroll && (
        <div className='table-controls'>
          <button
            type='button'
            className='ui circular button table-playpause'
            onClick={() => setIsManualPaused(prev => !prev)}
            aria-label={isPaused ? 'Play scrolling table' : 'Pause scrolling table'}
            title={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>
        </div>
      )}

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
  showAudio: PropTypes.bool,
  infiniteScroll: PropTypes.bool,
  rowsToShow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pauseLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pauseDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default React.memo(AdvancedTableBlockTemplate);
