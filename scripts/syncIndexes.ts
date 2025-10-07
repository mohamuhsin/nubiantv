/**
 * Sync MongoDB indexes for all models.
 * ------------------------------------
 * Run with:  npx tsx scripts/syncIndexes.ts
 * Ensures that MongoDB indexes match your current schema definitions.
 */

import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load environment variables early
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ⚙️ Import after dotenv so env vars are loaded
import Vote from "@/models/votes";

async function main(): Promise<void> {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      "❌ Missing MongoDB connection string.\nPlease set MONGODB_URL or MONGODB_URI in your .env.local file."
    );
    process.exit(1);
  }

  try {
    console.log("🚀 Connecting to MongoDB...");
    console.log(
      "🔍 Using URI:",
      mongoUri.replace(/\/\/.*@/, "//<credentials>@")
    );

    await mongoose.connect(mongoUri);
    console.log("✅ Connected successfully");

    console.log("🔄 Syncing indexes for Vote model...");
    const result = await Vote.syncIndexes();
    console.log("✅ Indexes synced successfully!");
    if (result) console.log(result);

    // 📋 Show all active indexes
    const indexes = await Vote.collection.indexes();
    console.log("\n📊 Active Indexes:");
    console.table(
      indexes.map((i) => ({
        name: i.name,
        unique: !!i.unique,
        key: JSON.stringify(i.key),
      }))
    );

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing indexes:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
