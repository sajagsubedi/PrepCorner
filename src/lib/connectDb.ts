import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const connectDb = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
