import mongoose from "mongoose";

interface connectionObject {
  isConnected?: number;
}

const connection: connectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
