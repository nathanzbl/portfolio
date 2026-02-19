import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let sharedSocket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });
    }
    socketRef.current = sharedSocket;

    return () => {
      // Don't disconnect on unmount; socket is shared
    };
  }, []);

  return socketRef;
}
