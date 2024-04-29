import { COLOR_USAGES } from '../constant/COLOR_USAGES';
import { AppBooking } from '../services/OfficeRnDTypes/Booking';
import React, { useEffect, useRef } from 'react';
import { useInterval } from '../misc/realTime';

export default function Event({ event, topBool }: { event: AppBooking, topBool: boolean; }) {
  const style = getEventStyle(event);

  const messageRef = useRef(null);
  // let scrollFuntion = () => {};

  const scrollFuntion = () => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: 'end',
    });
  };

  // if (topBool) {
  //   scrollFuntion = () => {
  //     messageRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: 'start',
  //     });
  //   };
  // } else {
  //   scrollFuntion = () => {
  //     messageRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: 'end',
  //     });
  //   };
  // }

  const dataToShow = event.summary
    ? {
      title: event.summary,
      description: event.host,
    }
    : {
      title: event.host,
      description: event.summary,
    };

  useEffect(() => {
    scrollFuntion();
  }, [event]);

  return (
    <div ref={messageRef} className='event' style={style}>
      <div className='eventDetails'>
        <div className='eventRoomAndTime'>
          <span className='eventRoom'>
            {event.floor} - {event.room}
          </span>
          <EventTimeComponent
            start={new Date(event.startDateTime)}
            end={new Date(event.endDateTime)}
          />
        </div>
        <div className='eventTitle kollectif'>{dataToShow.title}</div>
        {dataToShow.description ? (
          <div className='eventDescription'>{dataToShow.description}</div>
        ) : ''}
      </div>
    </div>
  );
}

const isBookingAllDay = (start: Date, end: Date): boolean => {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return end.valueOf() - start.valueOf() == dayInMilliseconds;
};

function EventTimeComponent({ start, end }: { start: Date; end: Date; }) {
  return isBookingAllDay(start, end) ? (
    <div className='eventTime'>All Day</div>
  ) : (
    <div className='eventTime'>
      <span className='noWrap'>{formatTime(new Date(start))}</span> {' - '}
      <span className='noWrap'>{formatTime(new Date(end))}</span>
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
