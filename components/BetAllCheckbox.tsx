import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBetAllSpots } from '../lib/slices/blackjackSlice';

const BetAllCheckbox: React.FC<BetAllCheckboxProps> = () => {
  const betAllSpots = useSelector((state: RootState) => state.blackjack.betAllSpots);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center bg-gray-800 bg-opacity-70 p-2 rounded-tl-lg text-white">
      <input
        type="checkbox"
        checked={betAllSpots}
        onChange={(e) => dispatch(updateBetAllSpots(e.target.checked))}
        className="mr-2 form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
      />
      <label className="text-sm">Bet All Spots</label>
    </div>
  );
};

export default BetAllCheckbox;