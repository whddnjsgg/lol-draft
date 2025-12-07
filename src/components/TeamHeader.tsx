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
    const fallback = side === 'blue' ? 'Team X' : 'Team Y';
    const trimmed = localName.trim() || fallback;
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

  const getBanLabel = (index: number) => {
    // 안쪽부터 B1, 바깥쪽이 B5
    const num = side === 'blue' ? 5 - index : index + 1;
    return `B${num}`;
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
          <div key={index} className="ban-slot-wrapper">
            <button
              type="button"
              className={`ban-slot-small ${ban ? 'filled' : ''}`}
              onClick={() => onSlotClick(index)}
            >
              {ban && <img src={ban.image} alt={ban.name_ko} />}
            </button>
            <span className="ban-label">{getBanLabel(index)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamHeader;
