import React from 'react';
import { useInterval } from './realTime';

const TIME_TO_REFRESH = 1000 * 30; // 30 seconds

const eventsHappeningNow = [{ title: 'Event1' }, { title: 'Event2' }];
const eventsComingSoon = [{ title: 'Event4' }, { title: 'Event5' }];

export default function Home() {
  const [currentTime, setRealTime] = React.useState(new Date());

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    setRealTime(new Date());
  }, TIME_TO_REFRESH);

  return (
    <div className='container'>
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
      <div>
        <section>
          <div>Happening right now</div>
          <div>
            {eventsHappeningNow.map((event) => {
              return <div key={event.title}>{event.title}</div>;
            })}
          </div>
        </section>
        <section>
          <div>Coming soon</div>
          {eventsComingSoon.map((event) => {
            return <div key={event.title}>{event.title}</div>;
          })}
        </section>
      </div>
    </div>
  );
}
