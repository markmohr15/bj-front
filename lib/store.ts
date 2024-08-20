import { configureStore } from '@reduxjs/toolkit';
import blackjackReducer from './slices/blackjackSlice';
import sessionReducer from './slices/sessionSlice';
import { shuffleMiddleware } from './middleware/shuffle';

export const store = configureStore({
  reducer: {
    blackjack: blackjackReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shuffleMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// For actions where the immediate action is conditional
export const conditionalActionWithDelay = (
  immediateActionCreator,
  delayedActionCreator,
  condition,
  delay = 5000
) => async (dispatch, getState) => {
  if (condition(getState())) {
    dispatch(immediateActionCreator());

    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(delayedActionCreator());
        resolve(true);
      }, delay);
    });
  }
};

export const delayedConditionalAction = (
  immediateActionCreator,
  delayedActionCreator,
  condition,
  delay = 5000
) => async (dispatch, getState) => {
  // Dispatch the immediate action and wait for it to complete
  await dispatch(immediateActionCreator());
  
  const shouldRunDelayedAction = condition(getState());
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldRunDelayedAction) {
        dispatch(delayedActionCreator());
      }
      resolve(true);
    }, delay);
  });
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
