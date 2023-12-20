import React from "react";
import { useInterval } from "./realTime";

export default function Home() {
  const [currentTime, setRealTime] = React.useState(new Date());

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    function handleRealTime(currentTime: Date) {
      setRealTime(new Date());
    }
    handleRealTime(currentTime);
  }, 1000);


  let month = currentTime.toLocaleString('default', { month: 'long' });

  return <div className="container">
  <div className="display-time">
    <span>{currentTime.getDate()}, {month} {currentTime.getFullYear()} - </span>
    <span suppressHydrationWarning>{currentTime.getHours() + "." + String(currentTime.getMinutes()).padStart(2, '0') + "." + String(currentTime.getSeconds()).padStart(2, '0')}</span>
    </div>
</div>;
}
