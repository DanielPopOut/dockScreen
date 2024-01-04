export default function Event(location, name, timeStart, timeEnd, description) {
    return (
      <div className="event">
        <div className="eventDetails">
          <div className="eventTitle">Location - Title</div>
          <div className="eventTime">Duration</div>
        </div>
        <div className="eventDescription">
          This is a description of an event. Lorem ipsum si dolor
        </div>
      </div>
    );
  }