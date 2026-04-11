import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
app.use(express.json());

const server = http.createServer(app);

const PORT = 5000;

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("captain-online", ({ captainId }) => {
    if (captainId) socket.join(captainId.toString());
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.post("/emit-ride", (request, response) => {
  const { captainIds, ride } = request.body;
  captainIds.forEach((captainId: string) => {
    io.to(captainId).emit("new-ride", ride);
  });
  response.json({ success: true });
});

app.post("/ride-accepted", (request, response) => {
  const { rideId, captainId } = request.body;
  io.emit("ride-taken", { rideId });

  io.to(captainId).emit("ride-confirmed", { rideId });
  response.json({ success: true });
});

server.listen(PORT, () => {
  console.log(`Socket server running on port 5000`);
});
