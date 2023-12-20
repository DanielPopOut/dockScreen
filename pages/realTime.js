import React, { useState, useEffect, useRef } from "react";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// We can set Dynamic Variable Input on the go to delay with useInterval instead useEffect --> Not Exactly needed.
export const useInterval = (callback, delay) => {
  const savedCallback = React.useRef();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

