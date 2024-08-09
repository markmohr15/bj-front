import React from 'react';

interface BettingChipProps {
  amount: number;
}

const BettingChip: React.FC<BettingChipProps> = ({ amount }) => {
  const getChipColor = (amount: number): string => {
    if (amount >= 5000) return 'from-yellow-800 to-yellow-600'; // Brown
    if (amount >= 1000) return 'from-yellow-500 to-yellow-300'; // Yellow
    if (amount >= 500) return 'from-purple-800 to-purple-600';  // Purple
    if (amount >= 100) return 'from-gray-900 to-gray-700';      // Black
    if (amount >= 25) return 'from-green-800 to-green-600';     // Green
    if (amount >= 5) return 'from-red-800 to-red-600';          // Red
    return 'from-gray-200 to-white';                            // White
  };

  const chipColor = getChipColor(amount);
  const textColor = ['from-gray-200 to-white', 'from-yellow-500 to-yellow-300'].includes(chipColor) 
    ? 'text-gray-800' 
    : 'text-white';

  return (
    <div className="relative w-full h-full">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${chipColor} shadow-lg`}></div>
      <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-transparent to-black opacity-20"></div>
      <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white to-transparent opacity-30"></div>
      <div className={`absolute inset-0 flex items-center justify-center ${textColor} font-bold text-lg z-10`}>
        <span className="drop-shadow-md">${amount}</span>
      </div>
      <div className="absolute inset-0 rounded-full border-4 border-opacity-50 border-white"></div>
    </div>
  );
};

export default BettingChip;