import React from 'react';
import { parseISO, format } from 'date-fns';
import { formatMoney } from '../lib/formatMoney';

interface Session {
  id: string;
  startTime: string | null;
  endTime: string | null;
  handsPlayed: number;
  profitCents: number;
}

interface SessionListProps {
  sessions: Session[];
}

const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not started';
    try {
      const date = parseISO(dateTimeString);
      return format(date, 'MM/dd/yyyy HH:mm');
    } catch (error) {
      console.error('Error parsing date:', error, 'Date string:', dateTimeString);
      return 'Invalid Date';
    }
  };

  const getSessionStatus = (session: Session) => {
    if (!session.startTime) return 'Not started';
    if (!session.endTime) return 'Ongoing';
    return formatDateTime(session.endTime);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Start Time</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Hands</th>
            <th className="px-6 py-3">Profit</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="bg-white border-b">
              <td className="px-6 py-4 text-black">
                {formatDateTime(session.startTime)}
              </td>
              <td className="px-6 py-4 text-black">
                {getSessionStatus(session)}
              </td>
              <td className="px-6 py-4 text-black">{session.handsPlayed}</td>
              <td className={`px-6 py-4 ${session.profitCents >= 0 ? 'text-black' : 'text-red-500'}`}>
                {formatMoney(session.profitCents, { showSign: true })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionList;