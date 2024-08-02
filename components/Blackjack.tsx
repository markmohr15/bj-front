// components/Blackjack.tsx
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
import { updateSpotByNumber, clearTable, setSession, updateDiscards, 
         dealHand, checkAndTriggerDealerActions } from '../lib/slices/blackjackSlice';
import { endSession } from '../lib/slices/sessionSlice';
import { RootState } from '../lib/store';


interface BlackjackProps {
  initialSession: Session;
}

const Blackjack: React.FC<BlackjackProps> = ({ initialSession }) => {
  const dispatch = useDispatch();

  const { session, spots, dealerCards, isDealt, insuranceOffered,
          groupInsurance, currentSpotId, discardedCards, handId,
          loading, error } = useSelector((state: RootState) => state.blackjack);
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
        dispatch(checkAndTriggerDealerActions());
      });
    };
  }

  const handleEndSession = () => {
    dispatch(endSession(session.id))
      .unwrap()
      .then(() => setShowNewSessionModal(true))
      .catch((error) => console.error('Failed to end session:', error));
  };

  const endHand = () => {
    const activeSpots = spots.filter(spot => spot.active);
    const activeCardCount = activeSpots.reduce((sum, spot) => sum + spot.playerCards.length, 0);
    dispatch(updateDiscards(activeCardCount + dealerCards.length));
    dispatch(clearTable());
    // guessing this gets moved elsewhere since it should happen auto
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

  return (
    <div className="flex flex-col h-screen bg-green-800 overflow-hidden">
      <div className="flex justify-between items-start p-4 h-1/4">
        {/* Session metrics */}
        <div className="w-1/4 text-white">
          <h3 className="text-lg font-bold mb-2">Session Info</h3>
          <p>Hands played: {/* Add hands played count */}</p>
          <p>Total profit: ${currentSpotId}</p>
          {/* Add more metrics as needed */}
        </div>

        <div className="flex justify-center items-start space-x-4 w-1/2">
          <DiscardTray 
            totalDecks={session.decks}
            discardedPercentage={discardedCards / (52 * session.decks)}
          />
          <div className="w-64 h-32 bg-green-700 flex justify-center items-center">
            {dealerCards.map((card, index) => (
              <Card key={index} 
                    value={card[0]}
                    suit={card[1]} 
              />
            ))}
            {dealerCards.length == 1 && (
              <Card key={1} hidden/>
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

      {/* Middle section for player spots and deal button */}
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
                  isActive={currentSpotId && spot.id === currentSpotId}
                />
              </div>
            );
          })}
        </div>

        {/* Deal button */}
        {canDeal && !isDealt && (
          <button
            className=" bg-yellow-500 text-black font-bold py-2 px-4 rounded"
            onClick={handleDeal}
          >
            Deal
          </button>
        )}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {isDealt && insuranceOffered && groupInsurance && (
            <GroupInsurance/>
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