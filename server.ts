import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const PORT = "5000";

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("captain-online", ({ captainId, captainName }) => {
    socket.join(captainId);
    console.log(`Captain with ${captainId}  Name: ${captainName} is ONLINE`);
  });

  socket.on("ping-server", (data) => {
    console.log("Received from client:", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket server running on port 5000`);
});
