export interface Session {
  id: string;
  decks: number;
  numSpots: number;
  penetration: number;
  sixFive: boolean;
  stand17: boolean;
  startTime: string | null;
  endTime: string | null;
}