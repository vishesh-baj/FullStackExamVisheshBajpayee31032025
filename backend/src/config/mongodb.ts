import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB Connection error:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
