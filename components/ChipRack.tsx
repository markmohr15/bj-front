// components/ChipRack.tsx
import React from 'react';
import { Chip } from '../types/Chip';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedChipValue } from '../lib/slices/blackjackSlice';

const CHIPS: Chip[] = [
  { value: 1, color: 'from-gray-100 to-white' },
  { value: 5, color: 'from-red-700 to-red-600' },
  { value: 25, color: 'from-green-700 to-green-600' },
  { value: 100, color: 'from-gray-900 to-gray-800' },
  { value: 500, color: 'from-purple-700 to-purple-600' },
  { value: 1000, color: 'from-yellow-500 to-yellow-400' },
  { value: 5000, color: 'from-yellow-800 to-yellow-700' },
];

const ChipRack: React.FC<ChipRackProps> = () => {
  const dispatch = useDispatch();

  const selectedChipValue = useSelector((state: RootState) => state.blackjack.selectedChipValue);

  return (
    <div className="flex justify-between p-2 bg-gray-800 bg-opacity-70 rounded-tl-lg">
      {CHIPS.map((chip) => (
        <div
          key={chip.value}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer relative mx-1 ${
            selectedChipValue === chip.value ? 'animate-pulse ring-3 ring-yellow-400' : ''
          }`}
          onClick={() => dispatch(updateSelectedChipValue(chip.value))}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-b ${chip.color}`}></div>
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-transparent to-black opacity-20"></div>
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-t from-transparent to-white opacity-30"></div>
          <span className={`relative z-10 text-xs font-bold ${
            chip.color === 'from-gray-100 to-white' || chip.color === 'from-yellow-500 to-yellow-400' 
              ? 'text-gray-800' 
              : 'text-white'
          }`}>
            ${chip.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChipRack;