import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TimeDisplay = styled.div`
  font-size: 1rem;
  color: white;
  padding: 0.5rem;
  text-align: center;
`;

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <TimeDisplay>{time.toLocaleTimeString()}</TimeDisplay>;
}

export default Clock;
