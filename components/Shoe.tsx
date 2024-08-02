import React from 'react';

const Shoe: React.FC = () => {
  const height = 180;
  const width = 140;

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      {/* Shoe body */}
      <div 
        className="absolute inset-0 bg-gray-900 rounded-t-lg"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)' }}
      >
        {/* Shoe front face */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/5 bg-gray-800"
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}
        ></div>

        {/* Card exit slot */}
        <div 
          className="absolute top-1/4 left-0 w-full h-1/6 bg-gray-800"
          style={{ transform: 'skew(0deg, -5deg)' }}
        ></div>
      </div>
      
      {/* Shoe top edge */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-700 rounded-t-sm"></div>
      
      {/* Reflective top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white to-transparent opacity-20"></div>
    </div>
  );
};

export default Shoe;