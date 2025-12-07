import React from 'react';
import type { Champion } from '../types';

interface ChampionCardProps {
  champion: Champion;
  disabled: boolean;
  isActive: boolean;
  onClick: () => void;
}

const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  disabled,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`champion-card ${disabled ? 'disabled' : ''} ${
        isActive ? 'active' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      title={champion.name_ko}
    >
      <img src={champion.image} alt={champion.name_ko} />
      <div className="champion-name">{champion.name_ko}</div>
    </button>
  );
};

export default ChampionCard;
