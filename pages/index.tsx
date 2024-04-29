import Event from '@/src/components/event';
import { AppBooking } from '@/src/services/OfficeRnDTypes/Booking';
import React, { PropsWithChildren, useEffect } from 'react';
import { useInterval } from '../src/misc/realTime';
import { useIsOverflow } from '@/src/helpers/overflowChecker';

const TIME_TO_REFRESH = 1000 * 30; // 30 seconds
const TIME_TO_GET_REQUEST = 3 * 60 * 1000; // 5 minutes refershing token

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
    const currentTime = new Date();
    // Only fetching events during 5 - 22
    if (currentTime.getHours() < 22 && currentTime.getHours() > 5) {
      console.log('fetching Event');
      fetch('/api/getEvents')
        .then((res) => res.json())
        .then((apiEventData) => setEventData(apiEventData))
        .catch((e) => {
          console.error('Error fetching events');
          console.error(e);
        });
    }

    // fetch('/api/getEventBriteEvent')
    //   .then((res) => res.json())
    //   .then((apiEventBriteEvent) => setEventBriteData(apiEventBriteEvent));
  }, TIME_TO_GET_REQUEST);

  const eventsHappeningNow = eventData.started;
  const eventsComingSoon = eventData.upcoming;
  const eventBriteEventsNow = eventBriteData.started;
  const eventBriteEventsComingSoon = eventBriteData.upcoming;

  // overflowRef is not reliable
  const overflowRef = React.useRef();
  const isOverflow = useIsOverflow(overflowRef);

  return (
    <div className='event_page'>
      <div className='child_section left_section no-scrollbar' ref={overflowRef}>
        <Section title='Happening right now'>
          <div className='event_section__list'>
            {eventsHappeningNow.map((event, index) => {
              // TODO: check if isOverflow is correct
              // if (isOverflow) {
                if (eventsHappeningNow.length - 1 === index) {
                  return <Event event={event} key={event._id} scrollYes={true} delay={true} />;
                }
                if (eventsComingSoon.length === 0) {
                  if (index === 0) {
                    console.log(event.summary);
                    return <Event event={event} key={event._id} scrollYes={true} delay={false} />;
                  }
                }
              // }
              else {
                return <Event event={event} key={event._id} scrollYes={false} delay={false} />;
              }
            })}
          </div>
        </Section>
        <Section title='Later today'>
          <div className='event_section__list'>
            {eventsComingSoon.map((event, index) => {
              // TODO: check if isOverflow is correct
              // if (isOverflow) {
                if (eventsHappeningNow.length === 0) {
                  if (eventsHappeningNow.length - 1 === index) {
                    return <Event event={event} key={event._id} scrollYes={true} delay={true} />;
                  }
                }
                if (index === 0) {
                  console.log(event.summary);
                  return <Event event={event} key={event._id} scrollYes={true} delay={false} />;
                }
              // }
              else {
                return <Event event={event} key={event._id} scrollYes={false} delay={false} />;
              }
            })}
          </div>
        </Section>
      </div>
      <div className='child_section right_section'>
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

const Section = (props: PropsWithChildren<{ title: string; }>) => {
  return (
    <section className='event_section'>
      <SectionTitle>{props.title}</SectionTitle>
      {props.children}
    </section>
  );
};

const SectionTitle = ({ children }: PropsWithChildren<{}>) => {
  return <div className='event_section__title'>{children}</div>;
};
