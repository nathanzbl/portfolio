import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { Spinner } from '../../components/ui/Spinner';

export function GameLobbyPage() {
  const { roomCode = '' } = useParams<{ roomCode: string }>();
  const [nameInput, setNameInput] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  const { room, players, isHost, joined, error } = useRoom(
    submittedName ? roomCode : '',
    submittedName
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    setSubmittedName(name);
  };

  // Name entry screen
  if (!submittedName) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Room</p>
            <h1 className="text-5xl font-bold text-white tracking-widest">{roomCode.toUpperCase()}</h1>
          </div>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg"
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={() => setSubmittedName('')}
            className="text-gray-400 hover:text-white underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Connecting / loading
  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="border-white w-10 h-10" />
      </div>
    );
  }

  // Lobby
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            {room?.status === 'lobby' ? 'Waiting for host...' : room?.status}
          </p>
          <h1 className="text-4xl font-bold text-white tracking-widest">{roomCode.toUpperCase()}</h1>
          {isHost && (
            <span className="mt-2 inline-block bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              YOU ARE THE HOST
            </span>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4 px-1">
            Players ({players.length})
          </p>
          <ul className="space-y-2">
            {players.map(player => (
              <li
                key={player.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-700/50"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {player.player_name[0].toUpperCase()}
                </div>
                <span className="text-white font-medium">{player.player_name}</span>
                {player.is_host && (
                  <span className="ml-auto text-yellow-400 text-xs">Host</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Share room code <strong className="text-gray-400">{roomCode.toUpperCase()}</strong> with friends
        </p>
      </div>
    </div>
  );
}
