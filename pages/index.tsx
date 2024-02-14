import Event from '@/src/components/event';
import { AppBooking } from '@/src/services/OfficeRnDTypes/Booking';
import React, { PropsWithChildren } from 'react';
import { useInterval } from './realTime';

const TIME_TO_REFRESH = 1000 * 30; // 30 seconds
const TIME_TO_GET_REQUEST = 30 * 60 * 1000; // 30 minutes refershing token

export default function Home() {
  const [currentTime, setRealTime] = React.useState(new Date());

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    setRealTime(new Date());
  }, TIME_TO_REFRESH);

  const [eventData, setEventData] = React.useState({
    started: Array<AppBooking>(),
    upcoming: Array<AppBooking>(),
  });
  const [eventBriteData, setEventBriteData] = React.useState({
    started: Array<any>(),
    upcoming: Array<any>(),
  });

  useInterval(() => {
    fetch('/api/getEvents')
      .then((res) => res.json())
      .then((apiEventData) => setEventData(apiEventData));
    fetch('/api/getEventBriteEvent')
      .then((res) => res.json())
      .then((apiEventBriteEvent) => setEventBriteData(apiEventBriteEvent));
  }, TIME_TO_GET_REQUEST);

  const eventsHappeningNow = eventData.started;
  const eventsComingSoon = eventData.upcoming;
  const eventBriteEventsNow = eventBriteData.started;
  const eventBriteEventsComingSoon = eventBriteData.upcoming;

  return (
    <div className='event_page'>
      <div className='left_section'>
        <Section title='Happening right now'>
          <div className='event_section__list'>
            {eventsHappeningNow.map((event) => {
              return <Event event={event} key={event._id} />;
            })}
          </div>
        </Section>
        <Section title='Later today'>
          <div className='event_section__list'>
            {eventsComingSoon.map((event) => {
              return <Event event={event} key={event._id} />;
            })}
          </div>
        </Section>
      </div>
      <div className='right_section'>
        <div className='display-time'>
          <span id='timeValue'>
            {Intl.DateTimeFormat('en-US', {
              minute: 'numeric',
              hour: 'numeric',
            }).format(currentTime)}
          </span>
          <span>
            {Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(currentTime)}
          </span>
        </div>
        <img className='logo' src='theDockLogoSquareColors.png' />
      </div>
    </div>
  );
}

const Section = (props: PropsWithChildren<{ title: string }>) => {
  return (
    <section className='event_section'>
      <SectionTitle>{props.title}</SectionTitle>
      {props.children}
    </section>
  );
};

const SectionTitle = ({ children }: PropsWithChildren) => {
  return <div className='event_section__title'>{children}</div>;
};
