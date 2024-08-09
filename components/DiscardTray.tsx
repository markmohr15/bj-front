import React from 'react';

interface DiscardTrayProps {
  totalDecks: number;
  discardedPercentage: number;
}

const DiscardTray: React.FC<DiscardTrayProps> = ({ totalDecks, discardedPercentage }) => {
  const height = 180; // Total height
  const width = 120;
  const baseHeight = height / 6; // Height of the base
  const cardAreaHeight = height - baseHeight; // Height available for cards
  const fillHeight = Math.min(discardedPercentage * cardAreaHeight, cardAreaHeight);

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <div className="absolute inset-0 bg-gray-800 rounded-sm overflow-hidden">
        {discardedPercentage > 0 && (
          <div 
            className="absolute left-0 right-0 bg-gradient-to-b from-white to-gray-200 transition-all duration-300 ease-in-out"
            style={{ 
              height: `${fillHeight}px`, 
              bottom: `${baseHeight}px`
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(Math.ceil(fillHeight / 2))].map((_, index) => (
                <div 
                  key={index}
                  className="h-px bg-gray-300 mt-1"
                ></div>
              ))}
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gray-900"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gray-700 rounded-b-sm"></div>      
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white to-transparent opacity-50"></div>
    </div>
  );
};

export default DiscardTray;