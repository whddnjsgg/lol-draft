import { useEffect, useState } from 'react';
import type { Champion } from '../types';

interface UseChampionsResult {
  champions: Champion[];
  loading: boolean;
  error: Error | null;
}

const VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const LOCALE = 'ko_KR';

export function useChampions(): UseChampionsResult {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        // 1) 최신 버전 조회
        const vRes = await fetch(VERSIONS_URL);
        if (!vRes.ok) {
          throw new Error('Failed to fetch Data Dragon versions');
        }
        const versions: string[] = await vRes.json();
        const latest = versions[0];
        const dataUrl = `https://ddragon.leagueoflegends.com/cdn/${latest}/data/${LOCALE}/champion.json`;
        const imgBase = `https://ddragon.leagueoflegends.com/cdn/${latest}/img/champion/`;

        // 2) 챔피언 데이터 조회
        const res = await fetch(dataUrl);
        if (!res.ok) {
          throw new Error('Failed to fetch champion data');
        }
        const data = await res.json();

        const champs: Champion[] = Object.values<any>(data.data).map((c) => ({
          id: c.id,
          key: c.key,
          name: c.name,
          name_ko: c.name,
          image: imgBase + c.image.full,
        }));

        // 한글 이름 기준 정렬
        champs.sort((a, b) => a.name_ko.localeCompare(b.name_ko, 'ko'));

        if (!cancelled) {
          setChampions(champs);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { champions, loading, error };
}
