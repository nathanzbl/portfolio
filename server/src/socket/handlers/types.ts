export interface SocketData {
  roomCode?: string;
  playerId?: number;
  playerName?: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
}
