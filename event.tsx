import { AppBooking } from './src/services/OfficeRnDTypes/Booking';

export default function Event({ event }: { event: AppBooking }) {
  return (
    <div className='event'>
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
