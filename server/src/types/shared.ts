export interface JwtPayload {
  userId: number;
  username: string;
}

export interface Player {
  id: number;
  playerName: string;
  socketId: string | null;
  isHost: boolean;
  joinedAt: string;
}

export interface Room {
  id: number;
  roomCode: string;
  gameType: string;
  status: 'lobby' | 'active' | 'closed';
  createdAt: string;
}
