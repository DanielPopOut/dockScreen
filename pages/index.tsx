import React from "react";
import { useInterval } from "./realTime";

export default function Home() {
  const [currentTime, setRealTime] = React.useState("");

  // useEffect is fine to use as well. Don't need useInterval
  useInterval(() => {
    function handleRealTime(currentTime: React.SetStateAction<string>) {
      let tempCurrentDate = new Date();
      currentTime = tempCurrentDate.getHours() + "." + String(tempCurrentDate.getMinutes()).padStart(2, '0') + "." + String(tempCurrentDate.getSeconds()).padStart(2, '0');
      setRealTime(currentTime);
    }
    handleRealTime(currentTime);
  }, 1000);
  return <div className="display-time">{currentTime}</div>;
}
