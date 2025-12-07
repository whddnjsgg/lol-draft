import React from 'react';
import type { Champion } from '../types';

interface PickColumnProps {
  side: 'blue' | 'red';
  picks: (Champion | null)[];
  onSlotClick: (index: number) => void;
}

const PickColumn: React.FC<PickColumnProps> = ({
  side,
  picks,
  onSlotClick,
}) => {
  return (
    <div className={`pick-column pick-column-${side}`}>
      {picks.map((pick, index) => (
        <div
          key={index}
          className={`pick-slot-wrapper ${index === 3 ? 'pick-group-gap' : ''}`}
        >
          <button
            type="button"
            className={`pick-slot-large ${pick ? 'filled' : ''}`}
            onClick={() => onSlotClick(index)}
          >
            {pick && <img src={pick.image} alt={pick.name_ko} />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PickColumn;
