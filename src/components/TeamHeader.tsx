import React, { useEffect, useState } from 'react';
import type { Champion } from '../types';

interface TeamHeaderProps {
  side: 'blue' | 'red';
  teamName: string;
  bans: (Champion | null)[];
  onSlotClick: (index: number) => void;
  onTeamNameChange: (name: string) => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  side,
  teamName,
  bans,
  onSlotClick,
  onTeamNameChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(teamName);

  useEffect(() => {
    setLocalName(teamName);
  }, [teamName]);

  const commit = () => {
    const trimmed = localName.trim() || (side === 'blue' ? 'Team X' : 'Team Y');
    onTeamNameChange(trimmed);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      setLocalName(teamName);
      setEditing(false);
    }
  };

  return (
    <div className={`team-header team-header-${side}`}>
      <div className="team-name-wrapper">
        {editing ? (
          <input
            className="team-name-input"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="team-name"
            onClick={() => setEditing(true)}
          >
            {teamName}
          </button>
        )}
      </div>
      <div className="team-bans-row">
        {bans.map((ban, index) => (
          <button
            key={index}
            type="button"
            className={`ban-slot-small ${ban ? 'filled' : ''}`}
            onClick={() => onSlotClick(index)}
          >
            {ban && <img src={ban.image} alt={ban.name_ko} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamHeader;
