/**
 * Represents a League of Legends champion. The `id` field
 * is the English identifier used internally (e.g. "Aatrox").
 */
export interface Champion {
  id: string;
  key: string;
  name: string;
  name_ko: string;
  image: string;
}

/**
 * Draft state tracks picks and bans for both teams. Each array
 * contains exactly five items; a null entry represents an empty slot.
 */
export interface DraftState {
  picks: {
    blue: (Champion | null)[];
    red: (Champion | null)[];
  };
  bans: {
    blue: (Champion | null)[];
    red: (Champion | null)[];
  };
}