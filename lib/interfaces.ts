import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { Socket } from 'net';

export interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

export interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & {
    server: SocketServer;
  };
}
