import React from 'react';
import { Champion, DraftState } from '../types';

export interface TeamPanelProps {
  team: 'blue' | 'red';
  picks: (Champion | null)[];
  bans: (Champion | null)[];
  setDraftState: React.Dispatch<React.SetStateAction<DraftState>>;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  /**
   * Callback invoked when a slot is clicked. The first parameter is the slot type
   * ('pick' or 'ban') and the second is the index (0–4).
   */
  onSlotClick: (type: 'pick' | 'ban', index: number) => void;
}

function TeamPanel({
  team,
  picks,
  bans,
  setDraftState,
  selectedIds,
  setSelectedIds,
  onSlotClick,
}: TeamPanelProps) {
  return (
    <div className={`team-panel ${team}`}>
      <h2>{team === 'blue' ? 'Team X' : 'Team Y'}</h2>
      <div className="ban-row">
        {bans.map((ban, index) => (
          <div
            key={index}
            className="ban-slot"
            onClick={() => onSlotClick('ban', index)}
          >
            {ban ? <img src={ban.image} alt={ban.name_ko} /> : null}
          </div>
        ))}
      </div>
      <div className="pick-row">
        {picks.map((pick, index) => (
          <div
            key={index}
            className="pick-slot"
            onClick={() => onSlotClick('pick', index)}
          >
            {pick ? <img src={pick.image} alt={pick.name_ko} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPanel;