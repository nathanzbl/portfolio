import { Server, Socket } from 'socket.io';
import {
  getRoomByCode,
  addPlayer,
  removePlayerBySocketId,
  getPlayersInRoom,
} from '../../services/games.service';
import { JoinRoomPayload } from './types';

export function registerRoomHandlers(io: Server, socket: Socket) {
  socket.on('join-room', async (payload: JoinRoomPayload) => {
    try {
      const { roomCode, playerName } = payload;

      if (!roomCode || !playerName) {
        socket.emit('error', { message: 'roomCode and playerName are required' });
        return;
      }

      const result = await getRoomByCode(roomCode);
      if (!result) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const { room, players } = result;

      if (room.status === 'closed') {
        socket.emit('error', { message: 'This room is closed' });
        return;
      }

      const isHost = players.length === 0;

      const player = await addPlayer(room.id, playerName, socket.id, isHost);

      // Store per-socket state for disconnect cleanup
      socket.data.roomCode = roomCode.toUpperCase();
      socket.data.playerId = player.id;
      socket.data.playerName = playerName;

      await socket.join(roomCode.toUpperCase());

      // Tell the joining player who they are
      socket.emit('player-joined', { player, isHost });

      // Broadcast updated player list to the whole room
      const updatedPlayers = await getPlayersInRoom(room.id);
      io.to(roomCode.toUpperCase()).emit('room-updated', {
        room,
        players: updatedPlayers,
      });
    } catch (err) {
      console.error('join-room error:', err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('leave-room', async () => {
    await handleLeave(io, socket);
  });

  socket.on('disconnect', async () => {
    await handleLeave(io, socket);
  });
}

async function handleLeave(io: Server, socket: Socket) {
  const { roomCode } = socket.data;
  if (!roomCode) return;

  try {
    const removedPlayer = await removePlayerBySocketId(socket.id);
    if (!removedPlayer) return;

    const result = await getRoomByCode(roomCode);
    if (!result) return;

    const { room, players } = result;

    io.to(roomCode).emit('player-left', {
      playerId: removedPlayer.id,
      players,
    });

    io.to(roomCode).emit('room-updated', { room, players });

    socket.data.roomCode = undefined;
    socket.data.playerId = undefined;
  } catch (err) {
    console.error('leave-room error:', err);
  }
}
