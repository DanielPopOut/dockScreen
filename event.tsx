import { AppBooking } from './src/services/OfficeRnDTypes/Booking';

export default function Event({ event }: { event: AppBooking }) {
  const style = getEventStyle(event);
  return (
    <div className='event' style={style}>
      <div className='eventDetails'>
        <div className='eventTitle'>
          {event.floor} - {event.room}
        </div>
        <div className='eventTime'>
          {new Date(event.startDateTime).toLocaleTimeString()}-
          {new Date(event.endDateTime).toLocaleTimeString()}
        </div>
      </div>
      <div className='eventDescription'>{event.summary}</div>
    </div>
  );
}

const getEventStyle = (event: AppBooking) => {
  if (event.floor.includes('1')) {
    return { backgroundColor: '#FFE6B5' };
  }
  if (event.floor.includes('3')) {
    return { backgroundColor: '#D2FFEA' };
  }
};
