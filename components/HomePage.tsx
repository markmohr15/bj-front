'use client';

import React from 'react';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern */}

      <div className="z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 shadow-lg">
          BJ AI
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12">
          Your Advanced Blackjack Analysis and Simulation Tool
        </p>
      </div>

    </div>
  );
};

export default HomePage;