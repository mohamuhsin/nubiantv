// scripts/syncIndexes.ts
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load environment variables early
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ⚠️ Import after dotenv so env vars are available
import Vote from "@/models/votes";

async function main(): Promise<void> {
  const mongoUri: string | undefined =
    process.env.MONGODB_URL || process.env.MONGODB_URI;

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

    // ✅ Type-safe connect (mongoUri is guaranteed string now)
    await mongoose.connect(mongoUri);

    console.log("✅ Connected successfully");
    console.log("🔄 Syncing indexes for Vote model...");

    // ⚙️ syncIndexes(): Drops old, adds new indexes per schema
    const result = await Vote.syncIndexes();
    console.log("✅ Indexes synced successfully!");
    console.log(result);

    // 📋 Display active indexes in a clean table
    const indexes = await Vote.collection.indexes();
    console.table(
      indexes.map((i) => ({
        name: i.name,
        unique: !!i.unique,
        key: JSON.stringify(i.key),
      }))
    );

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error syncing indexes:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
