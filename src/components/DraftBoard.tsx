import React from 'react';
import type { Champion, DraftState } from '../types';
import ChampionGrid from './ChampionGrid';
import TeamHeader from './TeamHeader';
import PickColumn from './PickColumn';

interface TeamNames {
  blue: string;
  red: string;
}

interface DraftBoardProps {
  champions: Champion[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  draftState: DraftState;
  setDraftState: React.Dispatch<React.SetStateAction<DraftState>>;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeChampionId: string | null;
  setActiveChampionId: React.Dispatch<React.SetStateAction<string | null>>;
  teamNames: TeamNames;
  setTeamNames: React.Dispatch<React.SetStateAction<TeamNames>>;
  onReset: () => void;
}

const DraftBoard: React.FC<DraftBoardProps> = ({
  champions,
  searchQuery,
  onSearchChange,
  draftState,
  setDraftState,
  selectedIds,
  setSelectedIds,
  activeChampionId,
  setActiveChampionId,
  teamNames,
  setTeamNames,
  onReset,
}) => {
  const activeChampion =
    activeChampionId != null
      ? champions.find((c) => c.id === activeChampionId) ?? null
      : null;

  const handleChampionClick = (champ: Champion) => {
    if (selectedIds.has(champ.id)) return;
    setActiveChampionId((prev) => (prev === champ.id ? null : champ.id));
  };

  const handleSlotClick = (
    team: 'blue' | 'red',
    type: 'pick' | 'ban',
    index: number,
  ) => {
    const slotArray =
      type === 'pick' ? draftState.picks[team] : draftState.bans[team];
    const current = slotArray[index];

    // 선택된 챔피언이 없으면 → 슬롯 비우기
    if (!activeChampion) {
      if (!current) return;

      setDraftState((prev) => {
        const next: DraftState = {
          picks: {
            blue: [...prev.picks.blue],
            red: [...prev.picks.red],
          },
          bans: {
            blue: [...prev.bans.blue],
            red: [...prev.bans.red],
          },
        };

        const target =
          type === 'pick' ? next.picks[team] : next.bans[team];
        target[index] = null;

        return next;
      });

      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(current.id);
        return next;
      });

      return;
    }

    // 이미 다른 슬롯에 사용된 챔피언이면 (현재 슬롯에 있는 경우 제외) 무시
    if (selectedIds.has(activeChampion.id) && (!current || current.id !== activeChampion.id)) {
      return;
    }

    let replaced: Champion | null = null;

    setDraftState((prev) => {
      const next: DraftState = {
        picks: {
          blue: [...prev.picks.blue],
          red: [...prev.picks.red],
        },
        bans: {
          blue: [...prev.bans.blue],
          red: [...prev.bans.red],
        },
      };

      const target =
        type === 'pick' ? next.picks[team] : next.bans[team];
      replaced = target[index];
      target[index] = activeChampion;

      return next;
    });

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (replaced && replaced.id !== activeChampion.id) {
        next.delete(replaced.id);
      }
      next.add(activeChampion.id);
      return next;
    });

    // 한 번 배치하면 선택 해제
    setActiveChampionId(null);
  };

  return (
    <div className="draft-board">
      <div className="draft-header-row">
        <TeamHeader
          side="blue"
          teamName={teamNames.blue}
          bans={draftState.bans.blue}
          onSlotClick={(idx) => handleSlotClick('blue', 'ban', idx)}
          onTeamNameChange={(name) =>
            setTeamNames((prev) => ({ ...prev, blue: name }))
          }
        />
        <div className="timer-wrapper">
          <div className="saroo-title">Saroo</div>
          <button type="button" className="reset-button" onClick={onReset}>
            Reset
          </button>
        </div>
        <TeamHeader
          side="red"
          teamName={teamNames.red}
          bans={draftState.bans.red}
          onSlotClick={(idx) => handleSlotClick('red', 'ban', idx)}
          onTeamNameChange={(name) =>
            setTeamNames((prev) => ({ ...prev, red: name }))
          }
        />
      </div>

      <div className="draft-main-row">
        <PickColumn
          side="blue"
          picks={draftState.picks.blue}
          onSlotClick={(idx) => handleSlotClick('blue', 'pick', idx)}
        />
        <div className="draft-center">
          <ChampionGrid
            champions={champions}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onChampionClick={handleChampionClick}
            selectedIds={selectedIds}
            activeChampionId={activeChampionId}
          />
        </div>
        <PickColumn
          side="red"
          picks={draftState.picks.red}
          onSlotClick={(idx) => handleSlotClick('red', 'pick', idx)}
        />
      </div>
    </div>
  );
};

export default DraftBoard;
