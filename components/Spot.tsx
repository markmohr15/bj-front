import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpotByNumber, clearBet, updateSpotInsurance, 
         playerActions, checkAndTriggerIntermediateActions,
         checkAndTriggerDealerActions, checkForBust, clearTable } from '../lib/slices/blackjackSlice';
import { SpotProps } from '../types/Spot';
import Card from './Card';
import BettingChip from './BettingChip';
import { conditionalActionWithDelay, delayedConditionalAction } from '../lib/store';

const Spot: React.FC<SpotProps> = ({ spot, isActive }) => {
  const dispatch = useDispatch();
  const { selectedChipValue, isDealt, insuranceOffered, 
          groupInsurance, currentSpotId } = useSelector((state: RootState) => state.blackjack);
  
  const [lastActionTimestamp, setLastActionTimestamp] = useState<number | null>(null);

  useEffect(() => {
    let bustCheckTimer: NodeJS.Timeout;
    if (lastActionTimestamp && spot.isBust) {
      bustCheckTimer = setTimeout(() => {
        dispatch(checkForBust(spot.id));
      }, 3000);
    }
    return () => {
      if (bustCheckTimer) clearTimeout(bustCheckTimer);
    };
  }, [lastActionTimestamp, spot.isBust, spot.id, dispatch]);

  const handleBetClick = () => {
    dispatch(updateSpotByNumber({ 
      spotNumber: spot.spotNumber, 
      changes: { wager: selectedChipValue } 
    }));
  };

  const handleClearClick = () => {
    dispatch(clearBet(spot.spotNumber));
  };

  const handleInsurance = async (insurance: boolean) => {
    try {
      await dispatch(updateSpotInsurance({ spotId: spot.id, insurance }));
      await dispatch(checkAndTriggerIntermediateActions());
      
      await dispatch(conditionalActionWithDelay(
        () => checkAndTriggerDealerActions(),
        () => clearTable(),
        (state) => !state.blackjack.hand?.currentSpotId,
        5000
      ));
    } catch (error) {
      console.error('Error in Spot handleInsurance:', error);
    }
  };

  const handleAction = async (action: 'hit' | 'stand' | 'double') => {
    await dispatch(playerActions({ spotId: spot.id, action }));
    setLastActionTimestamp(Date.now());

    dispatch(conditionalActionWithDelay(
      () => checkAndTriggerDealerActions(),
      () => clearTable(),
      (state) => !state.blackjack.hand?.currentSpotId,
      5000
    ));
  };

  const getResultDisplay = () => {
    switch (spot.result) {
      case 'win': return 'WIN';
      case 'loss': return 'LOSS';
      case 'push': return 'PUSH';
      case 'splitHand': return 'SPLIT';
      case 'bj': return 'BLACKJACK';
      default: return '';
    }
  };

  const renderCards = () => {
    const cardRows = [];
    for (let i = 0; i < spot.playerCards.length; i += 3) {
      cardRows.unshift(spot.playerCards.slice(i, i + 3));
    }

    return (
      <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: '165px' }}>
        {cardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1">
            {row.map((card, index) => (
              <div key={index} className="mx-1">
                <Card value={card[0]} suit={card[1]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`relative w-48 h-96 bg-green-700 rounded-lg p-2 ${isActive ? 'border-2 border-yellow-400' : ''}`}>
      {/* Player's cards */}
        {spot.active && renderCards()}

      {/* Betting circle and chip */}
      <div 
        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center ${isDealt ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!isDealt ? handleBetClick : undefined}
      >
        <div className="w-16 h-16">
          {spot.result !== 'loss' && (
            <BettingChip amount={spot.wager} />
          )}
        </div>

        {spot.double && spot.result !== 'loss' && (
          <div className="absolute right-full w-16 h-16" style={{ marginRight: '-9px' }}>
            <BettingChip amount={spot.wager} />
          </div>
        )}

        {spot.result === 'win' && (
          <div className="absolute bottom-full w-16 h-16" style={{ marginBottom: '-8px' }}>
            <BettingChip amount={spot.wager} />
          </div>
        )}

        {spot.result === 'bj' && (
          <div className="absolute bottom-full w-16 h-16" style={{ marginBottom: '-8px' }}>
            <BettingChip amount={spot.profit} />
          </div>
        )}

        {spot.double && spot.result === 'win' && (
          <div className="absolute right-full bottom-full w-16 h-16" style={{ marginRight: '-9px', marginBottom: '-8px' }}>
            <BettingChip amount={spot.wager} />
          </div>
        )}
      </div>

      {/* Clear button */}
      {!isDealt && spot.wager > 0 && (
        <button
          className="absolute bottom-1 left-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
          onClick={() => dispatch(clearBet(spot.spotNumber))}
        >
          Clear
        </button>
      )}

      {isActive && isDealt &&  (
        <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-1">
          {!insuranceOffered && (
            <>
              <div className="flex justify-center gap-1">
                {spot.playerCards.length === 2 && (
                  <button
                    onClick={() => handleAction('double')}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Double
                  </button>
                )}
                {spot.splitOffered && (
                  <button
                    onClick={() => handleAction('split')}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Split
                  </button>
                )}
              </div>
              <div className="flex justify-center gap-1">
                <button
                  onClick={() => handleAction('hit')}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Hit
                </button>
                <button
                  onClick={() => handleAction('stand')}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Stand
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {insuranceOffered && !groupInsurance && spot.active && spot.wager > 0 && spot.insurance === null && (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => handleInsurance(true)}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={() => handleInsurance(false)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      )}

      <div className="absolute top-2 right-2 font-bold">
        {spot.result && (
          <div>{getResultDisplay()}</div>  
        )} 
        {spot.insuranceResult && (
          <p>Insurance {spot.insuranceResult === 'ins_win' ? 'WIN' : 'LOSS'}</p>
        )}
      </div>
    </div>
  );
};

export default Spot;