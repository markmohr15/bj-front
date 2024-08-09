import React from 'react';

interface BettingChipProps {
  amount: number;
}

const BettingChip: React.FC<BettingChipProps> = ({ amount }) => {
  const getChipColor = (amount: number): string => {
    if (amount >= 5000) return 'from-yellow-800 to-yellow-700'; // Brown
    if (amount >= 1000) return 'from-yellow-500 to-yellow-400'; // Yellow
    if (amount >= 500) return 'from-purple-700 to-purple-600';  // Purple
    if (amount >= 100) return 'from-gray-900 to-gray-800';      // Black
    if (amount >= 25) return 'from-green-700 to-green-600';     // Green
    if (amount >= 5) return 'from-red-700 to-red-600';          // Red
    return 'from-gray-100 to-white';                            // White
  };

  const chipColor = getChipColor(amount);
  const textColor = ['from-gray-100 to-white', 'from-yellow-500 to-yellow-400'].includes(chipColor) 
    ? 'text-gray-800' 
    : 'text-white';

  return (
    <div className={`w-full h-full rounded-full ${chipColor} ${textColor} flex items-center justify-center font-bold relative bg-gradient-to-br`}>
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-br opacity-50"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-transparent to-black opacity-20"></div>
      <div className="relative z-10">${amount}</div>
    </div>
  );
};

export default BettingChip;