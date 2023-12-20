import React, { useState, useEffect, useRef } from "react";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// We can set Dynamic Variable Input on the go to delay with useInterval instead useEffect --> Not Exactly needed.
export const useInterval = (callback: Function, delay: Number) => {
  const savedCallback = React.useRef<Function>();

  React.useEffect(() => {
    savedCallback.current = callback;
    if (savedCallback.current) {
      savedCallback.current();
    }
  }, []);

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

