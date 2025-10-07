import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("Missing MongoDB connection string.");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection is undefined.");

  const votes = db.collection("votes");

  console.log("🔎 Finding votes with null or missing deviceHash...");
  const missingHashes = await votes
    .aggregate([
      {
        $match: {
          $or: [{ deviceHash: null }, { deviceHash: { $exists: false } }],
        },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ])
    .toArray();

  if (missingHashes.length === 0) {
    console.log("✨ No missing deviceHash values found.");
    await mongoose.disconnect();
    return;
  }

  console.log(
    `📊 Found ${missingHashes.length} categories with missing hashes.`
  );

  for (const cat of missingHashes) {
    console.log(`➡️ Category ${cat._id} (${cat.count} votes)`);

    const cursor = votes.find({
      category: cat._id,
      $or: [{ deviceHash: null }, { deviceHash: { $exists: false } }],
    });

    let count = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc?._id) continue;

      const uniqueHash = `missing-hash-${cat._id}-${doc._id
        .toString()
        .slice(-6)}`;
      await votes.updateOne(
        { _id: doc._id },
        { $set: { deviceHash: uniqueHash } }
      );
      count++;
    }

    console.log(`✅ Fixed ${count} votes in category ${cat._id}`);
  }

  console.log("🎉 All missing deviceHash fields patched successfully!");
  await mongoose.disconnect();
  console.log("🔌 Disconnected ✅");
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await mongoose.disconnect();
  process.exit(1);
});
