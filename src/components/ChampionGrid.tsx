import React from 'react';
import type { Champion } from '../types';
import ChampionCard from './ChampionCard';

interface ChampionGridProps {
  champions: Champion[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onChampionClick: (champion: Champion) => void;
  selectedIds: Set<string>;
  activeChampionId: string | null;
}

const normalize = (value: string) =>
  value.toLowerCase().replace(/\s+/g, '');

const ChampionGrid: React.FC<ChampionGridProps> = ({
  champions,
  searchQuery,
  onSearchChange,
  onChampionClick,
  selectedIds,
  activeChampionId,
}) => {
  const q = normalize(searchQuery);

  const filtered = champions.filter((c) => {
    if (!q) return true;
    return (
      normalize(c.name).includes(q) ||
      normalize(c.name_ko).includes(q) ||
      normalize(c.id).includes(q)
    );
  });

  return (
    <div className="champion-grid">
      <input
        className="champion-search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="champion-list">
        {filtered.map((champ) => (
          <ChampionCard
            key={champ.id}
            champion={champ}
            disabled={selectedIds.has(champ.id)}
            isActive={activeChampionId === champ.id}
            onClick={() => {
              if (selectedIds.has(champ.id)) return;
              onChampionClick(champ);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChampionGrid;
