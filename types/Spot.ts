export interface Spot {
  id: number | null;
  sessionId: number;
  spotNumber: number;
  wager: number;
  playerCards: string[];
  result: 'win' | 'loss' | 'push' | 'blackjack' | 'splitHand' | null;
  profit: number;
  insurance: boolean;
  insuranceResult: 'insWin' | 'insLoss' | null;
  split: boolean;
  double: boolean;
  active: boolean;
  isBlackjack: boolean;
  isBust: boolean;
  splitOffered: boolean;
}

export interface SpotProps {
  spot: SpotType;
  isActive: boolean;
}

