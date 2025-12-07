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

// 한글 음절에서 초성(ㄱ,ㄴ,ㄷ...)만 추출
const CHOSEONG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const CHOSEONG_BASE = 588; // 21 * 28

const getInitials = (value: string): string => {
  let result = '';
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
      const index = Math.floor((code - HANGUL_BASE) / CHOSEONG_BASE);
      result += CHOSEONG_LIST[index] ?? ch;
    } else {
      result += ch;
    }
  }
  return result;
};

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

    const nameNorm = normalize(c.name);
    const nameKoNorm = normalize(c.name_ko);
    const idNorm = normalize(c.id);
    const initialsNorm = normalize(getInitials(c.name_ko));

    return (
      nameNorm.includes(q) ||
      nameKoNorm.includes(q) ||
      idNorm.includes(q) ||
      initialsNorm.includes(q)
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
