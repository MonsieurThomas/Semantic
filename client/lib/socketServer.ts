import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Socket } from "net";

interface SocketServer extends HttpServer {
  io?: SocketIOServer;
}

export default function initializeSocketServer(res: NextApiResponse) {
  // Forcer le typage de res.socket
  const socket = res.socket as Socket & { server: HttpServer & { io?: SocketIOServer } };

  if (!socket.server.io) {
    console.log('Setting up socket.io');

    const io = new SocketIOServer(socket.server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    socket.server.io = io;
  }

  return socket.server.io;
}
