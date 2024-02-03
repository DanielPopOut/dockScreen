import { AppBooking } from '../services/OfficeRnDTypes/Booking';

export default function Event({ event }: { event: AppBooking }) {
  const style = getEventStyle(event);
  return (
    <div className='event' style={style}>
      <div className='eventDetails'>
        <div className='eventLeft'>
          <div className='eventTitle'>
            {event.host} - {event.floor} - {event.room}
          </div>
          <div className='eventDescription'>{event.summary}</div>
        </div>
        <EventTimeComponent start={new Date(event.startDateTime)} end={new Date(event.endDateTime)} />
      </div>
    </div>
  );
}

const isBookingAllDay = (start: Date, end: Date): boolean => {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return (end.valueOf() - start.valueOf()) == dayInMilliseconds;
};

function EventTimeComponent ({start, end}: {start: Date, end: Date}) {
  return isBookingAllDay(start, end) ? 
  (
    <div className='eventTime'>All Day</div>
  )
    :
  (
    <div className='eventTime'>
      {formatTime(new Date(start))} <br />
      - <br />
      {formatTime(new Date(end))}
    </div>
  )
}

const formatTime = (date: Date | number) => {
  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    // timeZone: 'Australia/Sydney',
  }).format(date);
};

const getEventStyle = (event: AppBooking) => {
  if (event.floor.includes('1')) {
    return { backgroundColor: '#FFE6B5' };
  }
  if (event.floor.includes('3')) {
    return { backgroundColor: '#D2FFEA' };
  }
};

export function EventBriteEvent({
  eventBriteEvent,
}: {
  eventBriteEvent: {
    location: string;
    name: string;
    timeStart: string;
    timeEnd: string;
    description: string;
    picUrl: string;
  };
}) {
  const { location, name, timeStart, timeEnd, description, picUrl } =
    eventBriteEvent;
  return (
    <div className='event'>
      <img src={picUrl} width='300' height='150' />
      <div className='eventDetails'>
        <div className='eventTitle'>
          {location} - {name}
        </div>
        <div className='eventTime'>
          {timeStart}-{timeEnd}
        </div>
      </div>
      <div className='eventDescription'>{description}</div>
    </div>
  );
}
