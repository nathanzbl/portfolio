import client from './client';
import type { Room, Player } from '../types/game';

export const createRoom = (gameType = 'general') =>
  client.post<Room>('/games/rooms', { gameType }).then(r => r.data);

export const getRoom = (code: string) =>
  client.get<{ room: Room; players: Player[] }>(`/games/rooms/${code}`).then(r => r.data);
