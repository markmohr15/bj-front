'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MenuProps {
  isLoggedIn: boolean;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onSignOutClick: () => void;
}

const Menu: React.FC<MenuProps> = ({ isLoggedIn, onSignInClick, onSignUpClick, onSignOutClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <nav className="relative z-20 bg-green-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">BJ AI</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
              <button onClick={onSignOutClick} className="hover:text-yellow-300">Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={onSignInClick} className="hover:text-yellow-300">Sign In</button>
              <button onClick={onSignUpClick} className="hover:text-yellow-300">Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-green-900 p-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="block w-full text-left py-2 hover:text-yellow-300">Dashboard</Link>
              <button onClick={onSignOutClick} className="block w-full text-left py-2 hover:text-yellow-300">Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={onSignInClick} className="block w-full text-left py-2 hover:text-yellow-300">Sign In</button>
              <button onClick={onSignUpClick} className="block w-full text-left py-2 hover:text-yellow-300">Sign Up</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Menu;