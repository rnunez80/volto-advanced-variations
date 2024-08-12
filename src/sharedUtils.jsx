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
      <span className='cal_time'>{startTime}</span>
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
  return end ? `${start} - ${end}` : start;
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
