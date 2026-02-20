import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const MONGODB_URL: string = process.env.MONGODB_URI as string;
if (!MONGODB_URL) {
  process.exit(1);
}

async function connectDB() {
  if (connection.isConnected) {
    console.log("Already connected to the database!!");
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URL);
    connection.isConnected = db.connections[0].readyState;
    console.log("MONGO DB connected successfully");
  } catch (error) {
    console.log("Mongo DB connection failed", error);
    process.exit(1);
  }
}

export default connectDB;
