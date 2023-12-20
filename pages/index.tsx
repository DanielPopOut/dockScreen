import React from 'react';
import { useInterval } from './realTime';

const TIME_TO_REFRESH = 1000 * 30; // 30 seconds
const TIME_TO_GET_REQUEST = 30 * 60 * 1000; // 30 minutes refershing token

export default function Home() {
  const [currentTime, setRealTime] = React.useState(new Date());

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    setRealTime(new Date());
  }, TIME_TO_REFRESH);

  const [currentData, setData] = React.useState({});
  useInterval(() => {
    fetch('/api/getEvents')
    .then(res => res.json())
    .then(resultData => setData(resultData))
  }, TIME_TO_GET_REQUEST);

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
    </div>
  );
}
