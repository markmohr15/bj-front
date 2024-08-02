import { configureStore } from '@reduxjs/toolkit';
import blackjackReducer from './slices/blackjackSlice';
import sessionReducer from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    blackjack: blackjackReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;