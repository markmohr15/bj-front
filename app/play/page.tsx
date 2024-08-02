// pages/play.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { fetchActiveSession, createSession, continueSession } from '../../lib/slices/sessionSlice';
import NewSessionModal from '../../components/NewSessionModal';
import Blackjack from '../../components/Blackjack';

const PlayPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { activeSession } = useAppSelector((state) => state.session);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);

  useEffect(() => {
    const isNewSession = searchParams.get('new') === 'true';
    if (isNewSession) {
      setShowNewSessionModal(true);
    } else {
      dispatch(fetchActiveSession());
    }
  }, [dispatch, searchParams]);

  const handleCreateSession = (input: CreateSessionInput) => {
    dispatch(createSession(input))
      .unwrap()
      .then(() => setShowNewSessionModal(false))
      .catch((error) => console.error('Failed to start new session:', error));
  };

  if (!activeSession && !showNewSessionModal) {
    return <div>No active session. <button onClick={() => setShowNewSessionModal(true)}>Start New Session</button></div>;
  }

  return (
    <div className="w-full h-screen">
      {activeSession && <Blackjack initialSession={activeSession} />}
      <NewSessionModal
        show={showNewSessionModal}
        onClose={() => router.push('/dashboard')}
        onSubmit={handleCreateSession}
      />
    </div>
  );
};

export default PlayPage;