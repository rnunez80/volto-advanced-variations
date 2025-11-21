export const getEventCard = (item) => {
  let startMonth = '', startDay = '', startWeekday = '', startTime = '';
  if (item.start) {
    if (item.recurrence && item.recurrence.startsWith('DTSTART')) {
      return (
        <div className='cal_date'>
          <span className='cal_month'>Recurring</span>
          <span className='cal_day'>Event</span>
          <span className='cal_wkday'>&nbsp;</span>
        </div>
      );
    }
    const parsedDate = new Date(Date.parse(item.start));
    startMonth = `${parsedDate.toLocaleString('default', { month: 'long' })}`;
    startDay = `${parsedDate.getDate()}`;
    startWeekday = `${parsedDate.toLocaleString('default', { weekday: 'long' })}`;
    startTime = `${parsedDate.toLocaleString('default', {
      hour: 'numeric', minute: 'numeric', hour12: true,
    })}`;
  }
  return (
    <div className='cal_date'>
      <span className='cal_month'>{startMonth}</span>
      <span className='cal_day'>{startDay}</span>
      <span className='cal_wkday'>{startWeekday}</span>
    </div>
  );
};

export const getEventDate = (item) => {
  let start = '', end = '';
  if (item.start) {
    const parsedDate = new Date(Date.parse(item.start));
    start = `${parsedDate.toLocaleString('default', { month: 'short' })} ${parsedDate.getDate()}`;
  }
  if (item.end) {
    const parsedEndDate = new Date(Date.parse(item.end));
    end = `${parsedEndDate.toLocaleString('default', { month: 'short' })} ${parsedEndDate.getDate()}`;
  }
  //if start and end are the same day, only show the start date
  if (start === end) {
    return end ? `${start}` : start;
  } else {
    return end ? `${start} - ${end}` : start;
  }
};

export const getEventTime = (item) => {
  let start = '', end = '';
  if (item.start) {
    const parsedDate = new Date(Date.parse(item.start));
    start = `${parsedDate.toLocaleString('default', {
      hour: 'numeric', minute: 'numeric', hour12: true,
    })}`;
  }
  if (item.end) {
    const parsedEndDate = new Date(Date.parse(item.end));
    end = `${parsedEndDate.toLocaleString('default', {
      hour: 'numeric', minute: 'numeric', hour12: true,
    })}`;
  }
  return end ? `${start} - ${end}` : start;
};

import React from 'react';

export const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { rootMargin: '0px 0px 0px 0px' });
    observer.observe(domRef.current);
    return () => observer.unobserve(domRef.current);
  }, []);

  return (
    <div ref={domRef}>
      <div
        className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
};
