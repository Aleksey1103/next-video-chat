import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from 'socket.io'

const port = parseInt(process.env['PORT'] || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    // Join a room
    socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);

        // Notify others
        socket.to(roomId).emit("new-peer", socket.id);
    });

    // Relay SDP offer/answer
    socket.on("signal", ({ roomId, data }) => {
        socket.to(roomId).emit("signal", { from: socket.id, data });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
    });
});

   httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
        console.log(
            `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`
        );
    });  
});