import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setNextAnimatingCard } from '../slices/blackjackSlice';

export const useCardAnimation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const animateCards = useCallback(async (
    cardsToAnimate: { card: string; spotNumber: number | null }[]
  ) => {
    for (const cardToAnimate of cardsToAnimate) {
      dispatch(setNextAnimatingCard(cardToAnimate));
      await new Promise<void>(resolve => {
        window.resolveCardAnimation = resolve;
      });
    }
  }, [dispatch]);

  return animateCards;
};