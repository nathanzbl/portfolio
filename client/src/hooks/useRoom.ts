import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import type { Room, Player, RoomUpdatedPayload, PlayerJoinedPayload, PlayerLeftPayload } from '../types/game';

export function useRoom(roomCode: string, playerName: string) {
  const socketRef = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomCode || !playerName) return;

    socket.emit('join-room', { roomCode, playerName });

    const onJoined = ({ player: _player, isHost: host }: PlayerJoinedPayload) => {
      setIsHost(host);
      setJoined(true);
      setError(null);
    };

    const onRoomUpdated = ({ room: r, players: p }: RoomUpdatedPayload) => {
      setRoom(r);
      setPlayers(p);
    };

    const onPlayerLeft = ({ players: p }: PlayerLeftPayload) => {
      setPlayers(p);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
    };

    socket.on('player-joined', onJoined);
    socket.on('room-updated', onRoomUpdated);
    socket.on('player-left', onPlayerLeft);
    socket.on('error', onError);

    return () => {
      socket.off('player-joined', onJoined);
      socket.off('room-updated', onRoomUpdated);
      socket.off('player-left', onPlayerLeft);
      socket.off('error', onError);
      socket.emit('leave-room');
    };
  }, [roomCode, playerName]);

  return { room, players, isHost, joined, error };
}
