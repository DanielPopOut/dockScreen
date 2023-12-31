import Event from '@/event';
import React, { PropsWithChildren } from 'react';
import { useInterval } from './realTime';

const TIME_TO_REFRESH = 1000 * 30; // 30 seconds
const TIME_TO_GET_REQUEST = 30 * 60 * 1000; // 30 minutes refershing token

const eventsHappeningNow = [
  {
    location: '3rd floor',
    name: 'Friday night breakdancing',
    timeStart: '12:00',
    timeEnd: '14:00',
    description:
      'Breakdancing on friday night of course! Breakdancing on friday night of course! Breakdancing on friday night of course!Breakdancing on friday night of course!Breakdancing on friday night of course!',
  },
  {
    location: '3rd floor',
    name: 'Friday night crying',
    timeStart: '12:00',
    timeEnd: '14:00',
    description: 'crying on friday night of course!',
  },
];
const eventsComingSoon = [{ title: 'Event4' }, { title: 'Event5' }];

export default function Home() {
  const [currentTime, setRealTime] = React.useState(new Date());

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    setRealTime(new Date());
  }, TIME_TO_REFRESH);

  const [currentData, setData] = React.useState({});
  useInterval(() => {
    fetch('/api/getEvents')
      .then((res) => res.json())
      .then((resultData) => setData(resultData));
  }, TIME_TO_GET_REQUEST);

  return (
    <div className='event_page'>
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
      <div className='left_section'>
        <Section title='Happening right now'>
          <div className='event_section__list'>
            {eventsHappeningNow.map((event) => {
              return <Event key={event.name} event={event} />;
            })}
          </div>
        </Section>
        <Section title='Coming soon'>
          <div className='event_section__list'>
            {eventsComingSoon.map((event) => {
              return <div key={event.title}>{event.title}</div>;
            })}
          </div>
        </Section>
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
