import { useState, useEffect } from 'react';
import type { Champion } from '../types';

/**
 * Custom hook to fetch the latest champion list from Riot's Data Dragon.
 * It returns an array of champions, a loading flag and an error object.
 */
export function useChampions() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Get the list of versions; the first element is the latest.
        const versionsResp = await fetch(
          'https://ddragon.leagueoflegends.com/api/versions.json'
        );
        const versions: string[] = await versionsResp.json();
        const latest = versions[0];
        // Fetch champion data in Korean.
        const champsResp = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latest}/data/ko_KR/champion.json`
        );
        const raw = await champsResp.json();
        const data = raw.data;
        const list: Champion[] = Object.keys(data).map((id) => {
          const champ = data[id];
          return {
            id: champ.id,
            key: champ.key,
            name: champ.id,
            name_ko: champ.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${latest}/img/champion/${champ.image.full}`,
          };
        });
        setChampions(list);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { champions, loading, error };
}