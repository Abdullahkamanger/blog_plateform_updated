import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    const conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected at: " + conn.connection.host + " and DB name is " + conn.connection.name);
  } catch (error) {
    console.log(error);
  }
};


export default connectDB;