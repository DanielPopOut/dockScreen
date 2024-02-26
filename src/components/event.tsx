import { COLOR_USAGES } from '../constant/COLOR_USAGES';
import { AppBooking } from '../services/OfficeRnDTypes/Booking';

export default function Event({ event }: { event: AppBooking }) {
  const style = getEventStyle(event);
  return (
    <div className='event' style={style}>
      <div className='eventDetails'>
        <div className='eventRoomAndTime'>
          <span>
            {event.floor} - {event.room}
          </span>
          <EventTimeComponent
            start={new Date(event.startDateTime)}
            end={new Date(event.endDateTime)}
          />
        </div>
        <div className='eventTitle'>{event.host}</div>
        {event.summary ? (
          <div className='eventDescription'>{event.summary}</div>
        ) : null}
      </div>
    </div>
  );
}

const isBookingAllDay = (start: Date, end: Date): boolean => {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return end.valueOf() - start.valueOf() == dayInMilliseconds;
};

function EventTimeComponent({ start, end }: { start: Date; end: Date }) {
  return isBookingAllDay(start, end) ? (
    <div className='eventTime'>All Day</div>
  ) : (
    <div className='eventTime'>
      {formatTime(new Date(start))} {' - '}
      {formatTime(new Date(end))}
    </div>
  );
}

const formatTime = (date: Date | number) => {
  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    // timeZone: 'Australia/Sydney',
  }).format(date);
};

const getEventStyle = (event: AppBooking) => {
  if (event.floor.includes('1')) {
    return { backgroundColor: COLOR_USAGES.FLOOR_1 };
  }
  if (event.floor.includes('3')) {
    return { backgroundColor: COLOR_USAGES.FLOOR_3 };
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
