import { AppBooking } from './src/services/OfficeRnDTypes/Booking';

export default function Event({ event }: { event: AppBooking }) {
  const style = getEventStyle(event);
  return (
    <div className='event' style={style}>
      <div className='eventDetails'>
        <div className='eventLeft'>
          <div className='eventTitle'>
            {event.team} - {event.floor} - {event.room}
          </div>
          <div className='eventDescription'>{event.summary}</div>
        </div>
        <div className='eventTime'>
          {formatTime(new Date(event.startDateTime))} <br />
          - <br />
          {formatTime(new Date(event.endDateTime))}
        </div>
      </div>
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
    return { backgroundColor: '#FFE6B5' };
  }
  if (event.floor.includes('3')) {
    return { backgroundColor: '#D2FFEA' };
  }
};
