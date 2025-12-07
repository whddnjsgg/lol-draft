import React from 'react';

export interface TimerProps {
  time: string;
  mode: string;
}

function Timer({ time, mode }: TimerProps) {
  return (
    <div className="timer">
      <div className="time">{time}</div>
      <div className="mode">{mode}</div>
    </div>
  );
}

export default Timer;