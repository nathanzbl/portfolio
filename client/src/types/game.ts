export interface Room {
  id: number;
  room_code: string;
  game_type: string;
  status: 'lobby' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: number;
  player_name: string;
  socket_id: string | null;
  is_host: boolean;
  joined_at: string;
}

export interface RoomUpdatedPayload {
  room: Room;
  players: Player[];
}

export interface PlayerJoinedPayload {
  player: Player;
  isHost: boolean;
}

export interface PlayerLeftPayload {
  playerId: number;
  players: Player[];
}
