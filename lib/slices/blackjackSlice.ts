import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../apolloClient';
import { Spot } from '../../types/Spot';
import { Hand } from '../../types/Hand';
import { Session } from '../../types/Session';
import { DEAL_HAND, UPDATE_INSURANCE, PLAYER_ACTIONS, INSURE_SPOTS,
         INTERMEDIATE_ACTIONS, DEALER_ACTIONS } from '../mutations/blackjack';

interface BlackjackState {
  session: Session | null;
  spots: Spot[];
  hand: Hand | null;
  isDealt: boolean;
  insuranceOffered: boolean;
  groupInsurance: boolean;
  betAllSpots: boolean;
  selectedChipValue: number | null;
  discardedCards: number;
  shuffling: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: BlackjackState = {
  session: null,
  spots: [],
  hand: null,
  isDealt: false,
  insuranceOffered: false,
  groupInsurance: true,
  betAllSpots: false,
  selectedChipValue: null,
  discardedCards: 0,
  shuffling: false,
  loading: false,
  error: null,
};

interface InsureSpotPayload {
  spotId: string;
  insure: boolean;
}

interface SpotInput {
  spotNumber: number;
  wager: number;
}

export const dealHand = createAsyncThunk(
  'blackjack/dealHand',
  async ({ sessionId, spots }: { sessionId: string; spots: SpotInput[] }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: DEAL_HAND,
        variables: { sessionId, spots },
      });

      if (data.dealHand.success) {
        return data.dealHand;
      } else {
        return rejectWithValue(data.dealHand.error);
      }
    } catch (error) {
      return rejectWithValue('An error occurred while dealing the hand');
    }
  }
);

export const updateSpotInsurance = createAsyncThunk(
  'blackjack/updateSpotInsurance',
  async ({ spotId, insurance }: { spotId: number; insurance: boolean }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateSpotById({ 
        id: spotId, 
        changes: { insurance: insurance } 
      }));

      const { data } = await client.mutate({
        mutation: UPDATE_INSURANCE,
        variables: { spotId, insurance },
      });

      if (data.updateInsurance) {
        return data.updateInsurance;
      } else {
        return rejectWithValue('Failed to update insurance on the server');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const playerActions = createAsyncThunk(
  'blackjack/playerActions',
  async ({ spotId, action }: { spotId: string; action: string }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: PLAYER_ACTIONS,
        variables: { spotId, action },
      });

      if (data.playerActions.errors && data.playerActions.errors.length > 0) {
        return rejectWithValue(data.playerActions.errors);
      }

      return data.playerActions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const insureAllSpots = createAsyncThunk(
  'blackjack/insureAllSpots',
  async (insurance: boolean, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const spotsToInsure = state.blackjack.spots
      .filter(spot => spot.wager > 0)
      .map(spot => ({ id: spot.id, insurance }));

    try {
      const { data } = await client.mutate({
        mutation: INSURE_SPOTS,
        variables: { spots: spotsToInsure }
      });

      if (data.insureSpots.errors && data.insureSpots.errors.length > 0) {
        return rejectWithValue(data.insureSpots.errors);
      }

      return data.insureSpots.spots;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAndTriggerIntermediateActions = createAsyncThunk(
  'blackjack/intermediateActions',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { spots, hand } = state.blackjack;
    const handId = hand.id;

    const activeSpots = spots.filter(spot => spot.active === true);
    const allActiveSpotInsured = activeSpots.every(spot => spot.insurance !== null);

    if (!allActiveSpotInsured || activeSpots.length === 0) {
      return rejectWithValue('Not all active spots are insured or no active spots');
    }

    try {
      const { data } = await client.mutate({
        mutation: INTERMEDIATE_ACTIONS,
        variables: { handId }
      });
      return data.intermediateActions;
    } catch (error) {
      console.error('Error in intermediate actions', error);
      return rejectWithValue(error.message);
    }
  }
);

export const checkAndTriggerDealerActions = createAsyncThunk(
  'blackjack/dealerActions',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { hand } = state.blackjack;
    const handId = hand.id;

    if (hand.currentSpotId) {
      return rejectWithValue('Not all spots have been played');
    }

    try {
      const { data } = await client.mutate({
        mutation: DEALER_ACTIONS,
        variables: { handId }
      });
      return data.dealerActions;
    } catch (error) {
      console.error('Error in dealer actions', error);
      return rejectWithValue(error.message);
    }
  }
);

const blackjackSlice = createSlice({
  name: 'blackjack',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
      state.spots = Array(action.payload.numSpots).fill(null).map((_, index) => ({
        id: null,
        sessionId: action.payload.id,
        spotNumber: index + 1,
        wager: 0,
        playerCards: [],
        splitOffered: null,
        isBlackjack: null,
        insurance: null,
        double: null,
        result: null,
        profit: null,
        active: true,
      }));
      state.shuffle = false;
      state.hand = {id: null, dealerCards: [], currentSpotId: null};
    },
    updateSpotByNumber: (state, action: PayloadAction<{ spotNumber: number; changes: Partial<Spot> }>) => {
      const { spotNumber, changes } = action.payload;
      const spotIndex = state.spots.findIndex(spot => spot.spotNumber === spotNumber);
      if ('wager' in changes && state.betAllSpots) {
        state.spots.map(spot => {
          spot.wager += changes.wager as number;
        })
      } else if ('wager' in changes) {
        state.spots[spotIndex].wager += changes.wager as number;
      } else {
        state.spots[spotIndex] = { ...state.spots[spotIndex], ...changes };
      }
    },
    updateSpotById: (state, action: PayloadAction<{ id: number; changes: Partial<Spot> }>) => {
      const { id, changes } = action.payload;
      const spotIndex = state.spots.findIndex(spot => spot.id === id);
      if (spotIndex !== -1) {
        state.spots[spotIndex] = { ...state.spots[spotIndex], ...changes };
      }
    },
    clearBet: (state, action: PayloadAction<number>) => {
      if (state.betAllSpots) {
        state.spots.map(spot => spot.wager = 0);
      } else {
        const spotIndex = state.spots.findIndex(spot => spot.spotNumber === action.payload);
        state.spots[spotIndex].wager = 0;
      }
    },
    clearTable: (state) => {
      state.spots = state.spots.map(spot => ({ ...spot, id: null, wager: 0, playerCards: [], 
                                              splitOffered: null, isBlackjack: null, isBust: null,
                                              insurance: null, double: null, split: null, result: null,
                                              profit: null, active: true, insuranceResult: null }));
      state.hand = {id: null, dealerCards: [], currentSpotId: null};
      state.isDealt = false;
      state.insuranceOffered = false;
    },
    checkForBust: (state, action: PayloadAction<number>) => {
      const spotIndex = state.spots.findIndex(spot => spot.id === action.payload);
      if (spotIndex !== -1 && state.spots[spotIndex].isBust ) {
        state.discardedCards += state.spots[spotIndex].playerCards.length;
        state.spots[spotIndex].active = false;
      }
    },
    updateSelectedChipValue: (state, action: PayloadAction<number>) => {
      state.selectedChipValue = action.payload;
    },
    updateBetAllSpots: (state, action: PayloadAction<boolean>) => {
      state.betAllSpots = action.payload;
    },
    updateGroupInsurance: (state) => {
      state.groupInsurance = false;
    },
    clearShuffle: (state) => {
      state.shuffle = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(dealHand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dealHand.fulfilled, (state, action) => {
        state.loading = false;
        const hand = action.payload.hand;
        state.hand = hand;
        state.isDealt = true;
        state.insuranceOffered = hand.insuranceOffered;
        hand.spots.forEach(dealtSpot => {
          const spotIndex = state.spots.findIndex(spot => spot.spotNumber === dealtSpot.spotNumber);
          if (spotIndex !== -1) {
            state.spots[spotIndex] = {
              ...state.spots[spotIndex],
              ...dealtSpot,
              insurance: null
            };
          }
        });

        state.spots.forEach(spot => {
          if (spot.wager === 0) {
            spot.active = false;
          }
        });        
      })
      .addCase(dealHand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSpotInsurance.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(playerActions.fulfilled, (state, action) => {
        state.loading = false;
        const spot = action.payload.spot;
        state.hand = spot.hand;
        const spotIndex = state.spots.findIndex(s => s.id === spot.id);
        if (spotIndex !== -1) {
          state.spots[spotIndex] = {
            ...state.spots[spotIndex],
            ...spot
          }
        }
      })
      .addCase(playerActions.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(insureAllSpots.pending, (state) => {
        state.loading = true;
      })
      .addCase(insureAllSpots.fulfilled, (state, action) => {
        state.loading = false;
        state.spots = state.spots.map(spot => {
          const updatedSpot = action.payload.find(s => s.id === spot.id);
          return updatedSpot ? { ...spot, ...updatedSpot } : spot;
        });
        state.insuranceOffered = false;
      })
      .addCase(insureAllSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAndTriggerIntermediateActions.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAndTriggerIntermediateActions.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceOffered = false;
        const hand = action.payload.hand;
        state.hand = hand;
        state.spots = state.spots.map(spot => {
          const updatedSpot = hand.spots.find(s => s.id === spot.id);
          return updatedSpot ? { ...spot, ...updatedSpot } : spot;
        });
      })
      .addCase(checkAndTriggerIntermediateActions.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(checkAndTriggerDealerActions.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAndTriggerDealerActions.fulfilled, (state, action) => {
        state.loading = false;
        const hand = action.payload.hand;
        state.hand = hand;
        state.discardedCards = hand.shoe.discardedCards;
        state.shuffle = hand.shoe.shuffle;
        state.session = { ...state.session, ...hand.session };
        state.spots = state.spots.map(spot => {
          const updatedSpot = hand.spots.find(s => s.id === spot.id);
          return updatedSpot ? { ...spot, ...updatedSpot } : spot;
        });
      })
      .addCase(checkAndTriggerDealerActions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { updateSpotByNumber, updateSpotById, clearTable, setSession, 
               checkForBust, updateSelectedChipValue,
               updateBetAllSpots, updateGroupInsurance,
               insureSpots, clearBet, clearShuffle } = blackjackSlice.actions;

export default blackjackSlice.reducer;