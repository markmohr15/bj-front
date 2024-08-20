import React from 'react';

interface CardProps {
  value: string | null;
  suit: 'H' | 'D' | 'C' | 'S' | null;
}

const Card: React.FC<CardProps> = ({ value, suit }) => {
  const suitSymbols = {
    H: '♥',
    D: '♦',
    C: '♣',
    S: '♠'
  };

  const suitColor = suit === 'H' || suit === 'D' ? 'text-red-600' : 'text-black';

  if (!value) {
    return (
      <div className="w-16 h-24 bg-red-600 rounded-lg shadow-md border border-gray-300"></div>
    );
  }

  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-md flex flex-col justify-between p-1">
      <div className={`text-left ${suitColor}`}>{value}</div>
      <div className={`text-center text-2xl ${suitColor}`}>{suitSymbols[suit]}</div>
      <div className={`text-right ${suitColor} self-end transform rotate-180`}>{value}</div>
    </div>
  );
};

export default Card;