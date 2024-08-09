import {checkAndTriggerDealerActions, clearShuffle} from '../slices/blackjackSlice';

export const shuffleMiddleware = store => next => action => {
  if (checkAndTriggerDealerActions.fulfilled.match(action) && action.payload.hand.shoe.shuffle) {
    setTimeout(() => {
      store.dispatch(clearShuffle());
    }, 6000);
  }
  return next(action);
};