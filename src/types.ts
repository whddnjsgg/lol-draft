export interface Champion {
  id: string;      // English id (e.g. "Aatrox")
  key: string;     // Numeric key as string
  name: string;    // English name or id
  name_ko: string; // Korean name
  image: string;   // Full URL to square icon
}

export interface DraftSide {
  blue: (Champion | null)[];
  red: (Champion | null)[];
}

export interface DraftState {
  picks: DraftSide;
  bans: DraftSide;
}
