import { useState, FormEvent } from 'react';
import type { Room } from '../../types/game';
import { createRoom, getRoom } from '../../api/games';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export function GamesPage() {
  const [gameType, setGameType] = useState('general');
  const [creating, setCreating] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState<{ room: Room; players: { id: number; player_name: string; is_host: boolean }[] } | null>(null);
  const [lookupError, setLookupError] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const room = await createRoom(gameType);
      setActiveRoom(room);
      setPlayerCount(0);
    } finally {
      setCreating(false);
    }
  };

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    try {
      const result = await getRoom(lookupCode.toUpperCase());
      setLookupResult(result as never);
    } catch {
      setLookupError('Room not found');
    }
  };

  const gameUrl = activeRoom
    ? `${window.location.origin}/game/${activeRoom.room_code}`
    : null;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Games</h1>

      {/* Create room */}
      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Create a Game Room</h2>
        <form onSubmit={handleCreate} className="flex gap-3 items-end">
          <Input
            label="Game Type"
            value={gameType}
            onChange={e => setGameType(e.target.value)}
            placeholder="general"
          />
          <Button type="submit" loading={creating}>Create Room</Button>
        </form>
      </Card>

      {/* Active room */}
      {activeRoom && (
        <Card className="p-6 mb-6 border-indigo-200 bg-indigo-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-indigo-500 uppercase tracking-widest mb-1">Room Code</p>
              <h2 className="text-4xl font-bold text-indigo-700 tracking-widest">{activeRoom.room_code}</h2>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium capitalize">
              {activeRoom.status}
            </span>
          </div>
          {gameUrl && (
            <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-4">
              <p className="text-xs text-gray-500 mb-1">Player join URL</p>
              <p className="text-sm font-mono text-gray-800 break-all">{gameUrl}</p>
            </div>
          )}
          <p className="text-sm text-indigo-600">{playerCount} player(s) connected</p>
        </Card>
      )}

      {/* Lookup room */}
      <Card className="p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Look Up a Room</h2>
        <form onSubmit={handleLookup} className="flex gap-3 items-end mb-4">
          <Input
            label="Room Code"
            value={lookupCode}
            onChange={e => setLookupCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={10}
          />
          <Button type="submit" variant="secondary">Look Up</Button>
        </form>
        {lookupError && <p className="text-sm text-red-600">{lookupError}</p>}
        {lookupResult && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Room <strong>{lookupResult.room.room_code}</strong> — {lookupResult.room.status}
            </p>
            <p className="text-sm text-gray-500 mb-2">{lookupResult.players.length} player(s):</p>
            <ul className="space-y-1">
              {lookupResult.players.map(p => (
                <li key={p.id} className="text-sm text-gray-700 flex items-center gap-2">
                  <span>{p.player_name}</span>
                  {p.is_host && <span className="text-xs text-yellow-600">Host</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
