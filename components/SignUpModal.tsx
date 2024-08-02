// components/SignUpModal.tsx
'use client';

import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { authService } from '../lib/authService';
import Modal from './Modal';

interface SignUpModalProps {
  show: boolean;
  onClose: () => void;
  onSignUpSuccess: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ show, onClose, onSignUpSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const client = useApolloClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await authService.signUp(client, email, password);
      if (user) {
        onSignUpSuccess();
        onClose();
        router.push('/dashboard')
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            required
            placeholder="Choose a password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </form>
    </Modal>
  );
};

export default SignUpModal;