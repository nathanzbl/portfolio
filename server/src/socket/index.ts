import { Server } from 'socket.io';
import { IncomingMessage, ServerResponse } from 'http';
import * as http from 'http';
import { registerRoomHandlers } from './handlers/roomHandlers';

export function initSocket(
  httpServer: http.Server<typeof IncomingMessage, typeof ServerResponse>
) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    registerRoomHandlers(io, socket);
  });

  return io;
}
