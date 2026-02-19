import pool from '../db/pool';

function generateRoomCode(length = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom(gameType: string, createdBy: number) {
  let roomCode: string;
  let attempts = 0;

  do {
    roomCode = generateRoomCode();
    const { rows } = await pool.query(
      'SELECT id FROM game_rooms WHERE room_code = $1',
      [roomCode]
    );
    if (rows.length === 0) break;
    attempts++;
  } while (attempts < 10);

  const { rows } = await pool.query(
    `INSERT INTO game_rooms (room_code, game_type, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [roomCode!, gameType, createdBy]
  );
  return rows[0];
}

export async function getRoomByCode(roomCode: string) {
  const { rows: roomRows } = await pool.query(
    'SELECT * FROM game_rooms WHERE room_code = $1',
    [roomCode.toUpperCase()]
  );

  if (roomRows.length === 0) return null;

  const room = roomRows[0];

  const { rows: players } = await pool.query(
    'SELECT id, player_name, socket_id, is_host, joined_at FROM game_players WHERE room_id = $1 ORDER BY joined_at ASC',
    [room.id]
  );

  return { room, players };
}

export async function updateRoomStatus(roomId: number, status: 'lobby' | 'active' | 'closed') {
  const { rows } = await pool.query(
    'UPDATE game_rooms SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, roomId]
  );
  return rows[0] ?? null;
}

export async function addPlayer(roomId: number, playerName: string, socketId: string, isHost: boolean) {
  const { rows } = await pool.query(
    `INSERT INTO game_players (room_id, player_name, socket_id, is_host)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [roomId, playerName, socketId, isHost]
  );
  return rows[0];
}

export async function removePlayerBySocketId(socketId: string) {
  const { rows } = await pool.query(
    'DELETE FROM game_players WHERE socket_id = $1 RETURNING *',
    [socketId]
  );
  return rows[0] ?? null;
}

export async function updatePlayerSocketId(playerId: number, socketId: string) {
  const { rows } = await pool.query(
    'UPDATE game_players SET socket_id = $1 WHERE id = $2 RETURNING *',
    [socketId, playerId]
  );
  return rows[0] ?? null;
}

export async function getPlayersInRoom(roomId: number) {
  const { rows } = await pool.query(
    'SELECT id, player_name, socket_id, is_host, joined_at FROM game_players WHERE room_id = $1 ORDER BY joined_at ASC',
    [roomId]
  );
  return rows;
}
