'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import Menu from './Menu';
import { authService } from '../lib/authService';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const client = useApolloClient();
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(authService.isLoggedIn());
  }, []);

  const handleSignOut = async () => {
    const success = await authService.signOut(client);
    if (success) {
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    setShowSignIn(false);
    router.push('/dashboard');
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setShowSignUp(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-800 bg-opacity-90">
      <Menu 
        isLoggedIn={isLoggedIn}
        onSignInClick={() => setShowSignIn(true)}
        onSignUpClick={() => setShowSignUp(true)}
        onSignOutClick={handleSignOut}
      />
      <main className="flex-grow">
        {children}
      </main>
      <SignUpModal 
        show={showSignUp} 
        onClose={() => setShowSignUp(false)}
        onSignUpSuccess={handleSignUpSuccess}
      />
      <SignInModal 
        show={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onSignInSuccess={handleSignInSuccess}
      />
      <footer className="bg-green-900 text-white p-4 text-center">
        <p>© 2024 BJ AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;