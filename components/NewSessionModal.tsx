import React, { useState } from 'react';
import Modal from './Modal';
import { CreateSessionInput } from '../lib/slices/sessionSlice';

interface NewSessionModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (sessionParams: CreateSessionInput) => void;
}

interface SessionParams {
  decks: number;
  numSpots: number;
  penetration: number;
  sixFive: boolean;
  stand17: boolean;
}

const NewSessionModal: React.FC<NewSessionModalProps> = ({ show, onClose, onSubmit }) => {
  const [sessionParams, setSessionParams] = useState<CreateSessionInput>({
    decks: 6,
    numSpots: 1,
    penetration: 75,
    sixFive: false,
    stand17: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSessionParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sessionParams);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-black">Start New Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="decks" className="block text-sm font-medium text-gray-700">Number of Decks (1-8)</label>
          <input
            type="number"
            id="decks"
            name="decks"
            value={sessionParams.decks}
            onChange={handleChange}
            min={1}
            max={8}
            className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="numSpots" className="block text-sm font-medium text-gray-700">Number of Spots (1-6)</label>
          <input
            type="number"
            id="numSpots"
            name="numSpots"
            value={sessionParams.numSpots}
            onChange={handleChange}
            min={1}
            max={6}
            className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="penetration" className="block text-sm font-medium text-gray-700">Penetration Percentage (10-90)</label>
          <input
            type="number"
            id="penetration"
            name="penetration"
            value={sessionParams.penetration}
            onChange={handleChange}
            min={10}
            max={90}
            className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              name="sixFive"
              checked={sessionParams.sixFive}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Pay 6:5 on Blackjack</span>
          </label>
        </div>
        <div>
          <label className="flex items-center text-black">
            <input
              type="checkbox"
              name="stand17"
              checked={sessionParams.stand17}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Dealer stands on soft 17</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Start Session
        </button>
      </form>
    </Modal>
  );
};

export default NewSessionModal;