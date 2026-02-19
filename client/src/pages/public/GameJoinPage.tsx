import { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoom } from '../../api/games';

const CODE_LENGTH = 6;

export function GameJoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length <= CODE_LENGTH) setCode(val);
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (code.length < CODE_LENGTH) {
      setError(`Room codes are ${CODE_LENGTH} characters`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { room } = await getRoom(code);
      if (room.status === 'closed') {
        setError('This room is closed');
        return;
      }
      navigate(`/game/${code}`);
    } catch {
      setError('Room not found — check the code and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      {/* Back link */}
      <a
        href="/"
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        ← Back to portfolio
      </a>

      <div className="w-full max-w-xs">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 text-3xl">
            🎮
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join a Game</h1>
          <p className="text-gray-400 text-sm">Enter the room code from your host</p>
        </div>

        {/* Code input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="XXXXXX"
              maxLength={CODE_LENGTH}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className={`w-full px-4 py-4 rounded-2xl bg-gray-800 text-white placeholder-gray-600
                border-2 text-center text-3xl font-bold tracking-[0.3em] uppercase
                focus:outline-none transition-colors
                ${error ? 'border-red-500' : code.length === CODE_LENGTH ? 'border-indigo-500' : 'border-gray-700 focus:border-indigo-600'}`}
            />
            {/* Character counter dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < code.length ? 'bg-indigo-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={code.length < CODE_LENGTH || loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg
              hover:bg-indigo-700 active:scale-95 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Finding room…
              </span>
            ) : (
              'Join Room'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-8">
          Ask your host for the room code
        </p>
      </div>
    </div>
  );
}
