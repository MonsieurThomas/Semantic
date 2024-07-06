import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & {
    server: SocketServer;
  };
}

export default function handler(req: NextApiRequest, res: ExtendedNextApiResponse) {
  if (!res.socket.server.io) {
    console.log("Setting up socket.io");

    const httpServer: HTTPServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
      },
    });

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }

  res.end();
}
