import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Shoe from './Shoe';
import Spot from './Spot';
import Card from './Card';
import AnimatedCard from './AnimatedCard';
import GroupInsurance from './GroupInsurance';
import ChipRack from './ChipRack';
import BetAllCheckbox from './BetAllCheckbox';
import DiscardTray from './DiscardTray';
import { Session } from '../types/Session';
import { Spot as SpotType } from '../types/Spot';
import { CardToAnimate } from '../types/CardToAnimate';
import { clearTable, setSession, dealHand, setNextAnimatingCard, 
         completeCardAnimation, checkAndTriggerDealerActions,
         handleBustOrBlackjack } from '../lib/slices/blackjackSlice';
import { endSession } from '../lib/slices/sessionSlice';
import { conditionalActionWithDelay, delay } from '../lib/store';
import { useCardAnimation } from '../lib/hooks/useCardAnimation';

interface BlackjackProps {
  initialSession: Session;
}

declare global {
  interface Window {
    resolveCardAnimation: (() => void) | null;
  }
}

const Blackjack: React.FC<BlackjackProps> = ({ initialSession }) => {
  const dispatch = useDispatch();
  const animateCards = useCardAnimation();
  const { session, spots, hand, isDealt, insuranceOffered, groupInsurance, 
          discardedCards, shuffle, currentAnimatingCard, dealAnimationComplete,
          loading, error } = useSelector((state: RootState) => state.blackjack);
  const reversedSpots = [...spots].reverse();

  useEffect(() => {
    dispatch(setSession(initialSession));
  }, [dispatch, initialSession]);

  const canDeal = spots.some(spot => spot.wager > 0);
  
  const handleDeal = async () => {
    if (session && canDeal) {
      try {
        const dealResult = await dispatch(
          dealHand({ sessionId: session.id, spots: spots.map(({ spotNumber, wager }) => ({ spotNumber, wager }))})
        ).unwrap();

        const cardsToAnimate: CardToAnimate[] = dealResult.hand.cardsToAnimate;
        for (const card of cardsToAnimate) {
          await animateCards([{
            card: card.card,
            spotNumber: card.spotNumber
          }]);
        }

        for (const spot of dealResult.hand.spots) {
          if (spot.isBlackjack && dealResult.hand.currentSpotId) {
            await delay(3000);
            dispatch(handleBustOrBlackjack(spot.id));
          }
        }
        
        dispatch(conditionalActionWithDelay(
          () => checkAndTriggerDealerActions(),
          () => clearTable(),
          (state) => !state.blackjack.hand?.currentSpotId,
          5000
        ));
      } catch (error) {
        console.error('problem with handleDeal');
      }
    };
  };

  const handleAnimationComplete = () => {
    dispatch(completeCardAnimation());
  };

  const getCardStartPosition = () => {
    const shoeElement = document.getElementById('shoe-position');
    if (shoeElement) {
      const rect = shoeElement.getBoundingClientRect();
      return { x: (rect.left + rect.right) / 2, y: rect.bottom };
    } else {
      return {x: 0, y: 0}
    }
  };

  const getCardEndPosition = (spotPosition) => {
    if (spotPosition === null) {
      const dealerElement = document.getElementById('dealer-position');
      if (dealerElement) {
        const rect = dealerElement.getBoundingClientRect();
        return { x: (rect.left + rect.right) / 2, y: rect.top };
      }
    } else {
      const spotElement = document.getElementById(`spot-${spotPosition}`);
      if (spotElement) {
        const rect = spotElement.getBoundingClientRect();
        return { x: (rect.left + rect.right) / 2, y: rect.top + rect.height / 3 };
      }
    }
    return { x: 0, y: 0 };
  };

  const handleEndSession = () => {
    dispatch(endSession(session.id))
      .unwrap()
      .then(() => setShowNewSessionModal(true))
      .catch((error) => console.error('Failed to end session:', error));
  };

  const getSpotPosition = (index: number, total: number) => {
    const maxSpots = 6;
    const radius = 60; // Increased radius for a wider arc
    const baseAngle = Math.PI / 2; // 90 degrees, adjust as needed
    let adjustedIndex = index;
    let adjustedTotal = maxSpots;

    if (total <= 2) {
      const spacing = 40;
      return { bottom: '5%', left: `${50 + (index - (total - 1) / 2) * spacing}%` };
    }

    const angle = baseAngle * (adjustedIndex - (adjustedTotal - 1) / 2) / (adjustedTotal - 1);
    const x = 50 + radius * Math.sin(angle);
    const y = 5 - radius * (Math.cos(angle) - 1) / 2;
    
    return { bottom: `${y}%`, left: `${x}%` };
  };

  if (!session) return null;

  const renderDealerCards = () => {
    const cardRows = [];
    const cards = hand.dealerCards.length === 1 && dealAnimationComplete ? [...hand.dealerCards, ""] : [...hand.dealerCards];
    for (let i = 0; i < cards.length; i += 3) {
      cardRows.push(cards.slice(i, i + 3));
    }
    return (
      <div className="absolute left-[50%] transform -translate-x-1/2" style={{ top: '95px', marginLeft: '-10px' }}>
        {cardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1">
            {row.map((card, index) => (
              <div key={index} className="mx-1">
                {card != "" ?
                  <Card value={card[0]} suit={card[1]} /> :
                  <Card hidden/>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-green-800 overflow-hidden">
      {currentAnimatingCard && (
        <AnimatedCard
          card={currentAnimatingCard.card}
          startPosition={getCardStartPosition()}
          endPosition={getCardEndPosition(currentAnimatingCard.spotNumber)}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      <div className="flex justify-between items-start p-4 h-1/4">
        <div className="w-1/4 text-white">
          <h3 className="text-lg font-bold mb-2">Session Info</h3>
          <p>Total profit: ${session.profit}</p>
          <p>Shoes played: {session.shoeCount}</p>
          <p>Hands played: {session.handCount}</p>
        </div>

        <div className="flex justify-center items-start space-x-4 w-1/2">
          <DiscardTray 
            totalDecks={session.decks}
            discardedPercentage={discardedCards / (52 * session.decks)}
          />
          <div className="w-64 h-32 bg-green-700 flex justify-center items-center"
               id="dealer-position"
          >
            {hand.dealerCards && renderDealerCards()}
            {hand.dealerCards && hand.dealerCards.length == 0 && shuffle && (
              <p>Shuffling....</p>
            )}
          </div>
          <Shoe />
        </div>

        <div className="w-1/4 flex justify-end">
          {!isDealt && (
            <button
              onClick={handleEndSession}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              End Session
            </button>
          )}          
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="flex justify-center w-full mb-8">
          {reversedSpots.map((spot, index) => {
            const position = getSpotPosition(index, spots.length);
            return (
              <div
                key={spot.spotNumber}
                className="absolute transform -translate-x-1/2"
                style={{ ...position, transition: 'all 0.3s ease-in-out' }}
              >
                <Spot
                  spot={spot}
                  isActive={dealAnimationComplete && hand.currentSpotId && spot.id === hand.currentSpotId}
                />
              </div>
            );
          })}
        </div>

        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {canDeal && !isDealt && (
            <button
              className=" bg-yellow-500 text-black font-bold py-2 px-4 rounded"
              onClick={handleDeal}
            >
              Deal
            </button>
          )}
        
          {dealAnimationComplete && insuranceOffered && groupInsurance && (
            <GroupInsurance/>
          )}

          {dealAnimationComplete && insuranceOffered && !groupInsurance && (
            <p>INSURANCE?</p>
          )}
        </div>
      </div>

      <div className="h-1/6 flex justify-end items-end p-4">
        {!isDealt && (
          <div className="flex items-end">
            {spots.length > 1 && <BetAllCheckbox />}
            <ChipRack />
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}

    </div>
  );
};

export default Blackjack;