'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { fetchLastTenSessions, fetchActiveSession } from '../../lib/slices/sessionSlice';
import SessionList from '../../components/SessionList';
import { useAuth } from '../../lib/hooks/useAuth';

const Dashboard: React.FC = () => {
  const isLoggedIn = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sessions, activeSession, loading, error } = useAppSelector((state) => state.session);

  React.useEffect(() => {
    dispatch(fetchLastTenSessions());
    dispatch(fetchActiveSession());
  }, [dispatch]);

  const handleCreateSession = () => {
    router.push('/play?new=true');
  };

  const handleContinueSession = () => {
    if (activeSession) {
      router.push('/play');
    }
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Left Column */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Game Options</h2>
            <button
              onClick={handleCreateSession}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 mb-4"
            >
              Start New Session
            </button>
            {activeSession && (
              <button
                onClick={handleContinueSession}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Continue Last Session
              </button>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-black">Last Ten Sessions</h3>
              <SessionList sessions={sessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;