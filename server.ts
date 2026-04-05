import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("ping-server", (data) => {
    console.log("Received from client:", data);

    socket.emit("pong-client", {
      message: "Server received your message",
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log(`Socket server running on port 5000`);
});
