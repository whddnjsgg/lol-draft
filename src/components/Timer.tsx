import React from 'react';

interface TimerProps {
  time: string;
  mode: string;
}

const Timer: React.FC<TimerProps> = ({ time, mode }) => {
  return (
    <div className="timer">
      <div className="time">{time}</div>
      <div className="mode">{mode}</div>
    </div>
  );
};

export default Timer;
