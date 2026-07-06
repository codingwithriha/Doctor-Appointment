import mongoose from "mongoose";
import "dotenv/config";

try {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected!");
} catch (err) {
  console.error(err);
}