export interface Session {
  id: number;
  decks: number;
  numSpots: number;
  penetrationIndex: number;
  sixFive: boolean;
  stand17: boolean;
  startTime: string | null;
  endTime: string | null;
  profit: number | null;
  shoeCount: number;
  handCount: number;
  spotCount: number;
}