import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Shoe from './Shoe';
import Spot from './Spot';
import Card from './Card';
import GroupInsurance from './GroupInsurance';
import ChipRack from './ChipRack';
import BetAllCheckbox from './BetAllCheckbox';
import DiscardTray from './DiscardTray';
import { Session } from '../types/Session';
import { Spot as SpotType } from '../types/Spot';
import { clearTable, setSession, dealHand, 
         checkAndTriggerDealerActions } from '../lib/slices/blackjackSlice';
import { endSession } from '../lib/slices/sessionSlice';
import { conditionalActionWithDelay } from '../lib/store';


interface BlackjackProps {
  initialSession: Session;
}

const Blackjack: React.FC<BlackjackProps> = ({ initialSession }) => {
  const dispatch = useDispatch();

  const { session, spots, hand, isDealt, insuranceOffered,
          groupInsurance, discardedCards, shuffle, loading, error } = useSelector((state: RootState) => state.blackjack);
  const reversedSpots = [...spots].reverse();

  useEffect(() => {
    dispatch(setSession(initialSession));
  }, [dispatch, initialSession]);

  const canDeal = spots.some(spot => spot.wager > 0);
  
  const handleDeal = () => {
    if (session && canDeal) {
      dispatch(
        dealHand({ sessionId: session.id, spots: spots.map(({ spotNumber, wager }) => ({ spotNumber, wager }))})
      ).then(() => {
          dispatch(conditionalActionWithDelay(
            () => checkAndTriggerDealerActions(),
            () => clearTable(),
            (state) => !state.blackjack.hand?.currentSpotId,
            5000
          ));
      });
    };
  }

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
    const cards = hand.dealerCards.length === 1 ? [...hand.dealerCards, ""] : [...hand.dealerCards];
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
          <div className="w-64 h-32 bg-green-700 flex justify-center items-center">
            {hand.dealerCards && renderDealerCards()}
            {hand.dealerCards.length == 0 && shuffle && (
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
        {/* Player spots */}
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
                  isActive={hand.currentSpotId && spot.id === hand.currentSpotId}
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
        
          {isDealt && insuranceOffered && groupInsurance && (
            <GroupInsurance/>
          )}

          {isDealt && insuranceOffered && !groupInsurance && (
            <p>INSURANCE?</p>
          )}
        </div>
      </div>

      {/* Bottom section for chip rack and bet all checkbox */}
      <div className="h-1/6 flex justify-end items-end p-4">
        {!isDealt && (
          <div className="flex items-end">
            {spots.length > 1 && <BetAllCheckbox />}
            <ChipRack />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}

    </div>
  );
};

export default Blackjack;