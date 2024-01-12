export default function Event({
  event,
}: {
  event: {
    location: string;
    name: string;
    timeStart: string;
    timeEnd: string;
    description: string;
  };
}) {
  const { location, name, timeStart, timeEnd, description } = event;
  return (
    <div className='event'>
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
