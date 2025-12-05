import React, { useState } from 'react';
import { useChampions } from './api/useChampions';
import type { DraftState } from './types';
import DraftBoard from './components/DraftBoard';

interface TeamNames {
  blue: string;
  red: string;
}

const createInitialDraftState = (): DraftState => ({
  picks: {
    blue: [null, null, null, null, null],
    red: [null, null, null, null, null],
  },
  bans: {
    blue: [null, null, null, null, null],
    red: [null, null, null, null, null],
  },
});

const App: React.FC = () => {
  const { champions, loading, error } = useChampions();
  const [searchQuery, setSearchQuery] = useState('');

  const [draftState, setDraftState] = useState<DraftState>(
    createInitialDraftState(),
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeChampionId, setActiveChampionId] = useState<string | null>(null);

  const [teamNames, setTeamNames] = useState<TeamNames>({
    blue: 'Team X',
    red: 'Team Y',
  });

  const handleReset = () => {
    setDraftState(createInitialDraftState());
    setSelectedIds(new Set());
    setActiveChampionId(null);
  };

  if (loading) {
    return <div className="loading-screen">챔피언 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="loading-screen">
        챔피언 데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <DraftBoard
      champions={champions}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      draftState={draftState}
      setDraftState={setDraftState}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      activeChampionId={activeChampionId}
      setActiveChampionId={setActiveChampionId}
      teamNames={teamNames}
      setTeamNames={setTeamNames}
      onReset={handleReset}
    />
  );
};

export default App;
