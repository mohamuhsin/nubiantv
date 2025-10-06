// scripts/syncIndexes.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Vote from "@/models/votes";

// ✅ Load environment variables
dotenv.config({ path: ".env.local" });

// ✅ Determine Mongo URI (Railway uses MONGODB_URI)
const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

if (!mongoUri) {
  console.error(
    "❌ Missing MongoDB connection string. Please set MONGODB_URL or MONGODB_URI in your .env.local file."
  );
  process.exit(1);
}

async function main() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    console.log("🔍 Using:", mongoUri);

    // ✅ Tell TypeScript it's definitely a string after the check
    await mongoose.connect(mongoUri as string);

    console.log("✅ Connected successfully");
    console.log("🔄 Syncing indexes for Vote model...");

    const result = await Vote.syncIndexes();
    console.log("✅ Indexes synced successfully!");
    console.log(result);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error syncing indexes:", error);
    process.exit(1);
  }
}

main();
