// src/app/api/socket/route.ts
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';

const config = {
  api: {
    bodyParser: false,
  },
};

const dynamic = 'force-dynamic';

async function GET(): Promise<Response> {
  return new Response('Socket.io endpoint', { status: 200 });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function handler(req: any, res: any): void {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as never;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('join', (roomId: string) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
      });

      socket.on('offer', ({ offer, roomId }) => {
        socket.to(roomId).emit('offer', offer);
      });

      socket.on('answer', ({ answer, roomId }) => {
        socket.to(roomId).emit('answer', answer);
      });

      socket.on('ice-candidate', ({ candidate, roomId }) => {
        socket.to(roomId).emit('ice-candidate', candidate);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}

export { config, dynamic, GET };
