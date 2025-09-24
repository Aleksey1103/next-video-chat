import { Server as HTTPServer } from 'http';
import { Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
}
