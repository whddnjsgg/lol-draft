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

// 초성 리스트
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

// 겹받침 / 쌍자음 분해
const JAMO_DECOMPOSE_MAP: Record<string, string> = {
  // 쌍자음
  'ㄲ': 'ㄱㄱ',
  'ㄸ': 'ㄷㄷ',
  'ㅃ': 'ㅂㅂ',
  'ㅆ': 'ㅅㅅ',
  'ㅉ': 'ㅈㅈ',
  // 겹받침
  'ㄳ': 'ㄱㅅ',
  'ㄵ': 'ㄴㅈ',
  'ㄶ': 'ㄴㅎ',
  'ㄺ': 'ㄹㄱ',
  'ㄻ': 'ㄹㅁ',
  'ㄼ': 'ㄹㅂ',
  'ㄽ': 'ㄹㅅ',
  'ㄾ': 'ㄹㅌ',
  'ㄿ': 'ㄹㅍ',
  'ㅀ': 'ㄹㅎ',
  'ㅄ': 'ㅂㅅ',
};

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const CHOSEONG_BASE = 588; // 21 * 28

const decomposeJamo = (value: string): string =>
  Array.from(value)
    .map((ch) => JAMO_DECOMPOSE_MAP[ch] ?? ch)
    .join('');

const normalize = (value: string) =>
  decomposeJamo(value)
    .toLowerCase()
    .replace(/\s+/g, '');

// 한글 음절에서 초성 추출
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

  const processed = champions
    .map((c) => {
      const nameNorm = normalize(c.name);
      const nameKoNorm = normalize(c.name_ko);
      const idNorm = normalize(c.id);
      const initialsNorm = normalize(getInitials(c.name_ko));

      const matches =
        !q ||
        nameNorm.includes(q) ||
        nameKoNorm.includes(q) ||
        idNorm.includes(q) ||
        initialsNorm.includes(q);

      return {
        champ: c,
        nameNorm,
        nameKoNorm,
        idNorm,
        initialsNorm,
        matches,
      };
    })
    .filter((x) => x.matches);

  const score = (item: {
    nameNorm: string;
    nameKoNorm: string;
    idNorm: string;
    initialsNorm: string;
  }): number => {
    if (!q) return 0;

    // 1) 초성이 앞에서부터 완전 일치 (라칸 = ㄹㅋ) → 최우선
    if (item.initialsNorm.startsWith(q)) return 0;

    // 2) 이름/아이디 앞부분이 일치
    if (
      item.nameKoNorm.startsWith(q) ||
      item.nameNorm.startsWith(q) ||
      item.idNorm.startsWith(q)
    ) {
      return 1;
    }

    // 3) 초성 중간에 포함
    if (item.initialsNorm.includes(q)) return 2;

    // 4) 이름/아이디 중간에 포함
    if (
      item.nameKoNorm.includes(q) ||
      item.nameNorm.includes(q) ||
      item.idNorm.includes(q)
    ) {
      return 3;
    }

    return 4;
  };

  const sorted = processed.sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return a.champ.name_ko.localeCompare(b.champ.name_ko, 'ko');
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
        {sorted.map(({ champ }) => (
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
