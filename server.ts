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

  socket.on("join", ({ userId }) => {
    socket.join(userId.toString());
    console.log("User joined room:", userId);
  });

  socket.on("captain-online", ({ captainId }) => {
    if (captainId) socket.join(captainId.toString());
    console.log("Captain joined the room", captainId);
  });

  socket.on("captain-arrived", ({ captainId, riderId }) => {
    console.log("Captain arrived", captainId);
    io.to(riderId).emit("captain-arrived", captainId);
  });

  socket.on("ride-started", ({ captainId, riderId }) => {
    console.log("Ride started by captain", captainId);
    io.to(riderId).emit("ride-started", captainId);
  });

  socket.on("ride-completed", ({ captainId, riderId }) => {
    console.log("Ride completed", captainId);
    io.to(riderId).emit("ride-completed", captainId);
  });

  socket.on("payment-completed", ({ captainId, rideId, riderId }) => {
    console.log("Payment completed", rideId, riderId);
    io.to(captainId).emit("payment-completed", rideId);
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
  const { rideId, captainId, riderId } = request.body;

  io.emit("ride-taken", { rideId });
  io.to(captainId).emit("ride-confirmed", { rideId });
  io.to(riderId).emit("ride-accepted", { rideId });
  response.json({ success: true });
});

server.listen(PORT, () => {
  console.log(`Socket server running on port 5000`);
});
