/**
 * 🧠 Self-Healing MongoDB Index Sync Script
 * -----------------------------------------
 * - Cleans null / empty / duplicate deviceSession & deviceHash fields
 * - Assigns unique placeholders to prevent index conflicts
 * - Drops old conflicting indexes
 * - Syncs schema-defined indexes safely
 *
 * Run with:  npx tsx scripts/syncIndexes.ts
 */

import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

// ✅ Load environment variables first
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ⚙️ Import after dotenv
import Vote from "@/models/votes";

async function main(): Promise<void> {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ Missing MongoDB connection string.");
    process.exit(1);
  }

  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected successfully");

    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection is undefined.");
    const votes = db.collection("votes");

    // =============================
    // 🧹 STEP 1: Clean null & empty
    // =============================
    console.log("🧹 Cleaning null, empty, or stringified null fields...");

    const cleanOps = [
      votes.updateMany(
        {
          $or: [
            { deviceSession: "" },
            { deviceSession: "null" },
            { deviceSession: "undefined" },
          ],
        },
        { $unset: { deviceSession: "" } }
      ),
      votes.updateMany(
        {
          $or: [
            { deviceHash: "" },
            { deviceHash: "null" },
            { deviceHash: "undefined" },
          ],
        },
        { $unset: { deviceHash: "" } }
      ),
    ];

    const results = await Promise.all(cleanOps);
    console.log(
      `✅ Cleaned ${results.reduce(
        (a, b) => a + b.modifiedCount,
        0
      )} invalid string fields.`
    );

    // ==========================================
    // 🧩 STEP 2: Fill missing deviceSession safely
    // ==========================================
    console.log("🧩 Repairing missing or null deviceSession fields...");

    const missingSessions = await votes
      .aggregate([
        {
          $match: {
            $or: [
              { deviceSession: null },
              { deviceSession: { $exists: false } },
            ],
          },
        },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    for (const cat of missingSessions) {
      const cursor = votes.find({
        category: cat._id,
        $or: [{ deviceSession: null }, { deviceSession: { $exists: false } }],
      });

      let count = 0;
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        if (!doc?._id) continue;

        const uniqueValue = `missing-session-${cat._id}-${(doc._id as ObjectId)
          .toString()
          .slice(-6)}`;
        await votes.updateOne(
          { _id: doc._id },
          { $set: { deviceSession: uniqueValue } }
        );
        count++;
      }

      if (count > 0)
        console.log(
          `✅ Fixed ${count} missing sessions in category ${cat._id}`
        );
    }

    // ==========================================
    // 🧩 STEP 3: Fill missing deviceHash safely
    // ==========================================
    console.log("🧩 Repairing missing or null deviceHash fields...");

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

    for (const cat of missingHashes) {
      const cursor = votes.find({
        category: cat._id,
        $or: [{ deviceHash: null }, { deviceHash: { $exists: false } }],
      });

      let count = 0;
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        if (!doc?._id) continue;

        const uniqueValue = `missing-hash-${cat._id}-${(doc._id as ObjectId)
          .toString()
          .slice(-6)}`;
        await votes.updateOne(
          { _id: doc._id },
          { $set: { deviceHash: uniqueValue } }
        );
        count++;
      }

      if (count > 0)
        console.log(`✅ Fixed ${count} missing hashes in category ${cat._id}`);
    }

    // ==========================================
    // 🧩 STEP 4: Deduplicate placeholders
    // ==========================================
    const dedupe = async (field: string) => {
      console.log(`🧩 Checking for duplicate placeholder ${field} values...`);
      const dupes = await votes
        .aggregate([
          {
            $match: { [field]: { $regex: /^missing-/ } },
          },
          {
            $group: {
              _id: { category: "$category", value: `$${field}` },
              ids: { $push: "$_id" },
              count: { $sum: 1 },
            },
          },
          { $match: { count: { $gt: 1 } } },
        ])
        .toArray();

      let totalFixed = 0;
      for (const group of dupes) {
        const ids = group.ids.slice(1);
        for (const id of ids) {
          const newVal = `${group._id.value}-${(id as ObjectId)
            .toString()
            .slice(-6)}`;
          await votes.updateOne({ _id: id }, { $set: { [field]: newVal } });
          totalFixed++;
        }
      }

      if (totalFixed > 0)
        console.log(`✅ Deduplicated ${totalFixed} ${field} placeholders.`);
      else console.log(`✨ No duplicate ${field} placeholders found.`);
    };

    await dedupe("deviceSession");
    await dedupe("deviceHash");

    // ==========================================
    // 🗑 STEP 5: Drop old conflicting indexes
    // ==========================================
    const existingIndexes = await votes.indexes();
    const dropIfExists = async (name: string) => {
      if (existingIndexes.some((i) => i.name === name)) {
        console.log(`🗑 Dropping old index: ${name}`);
        await votes.dropIndex(name).catch(() => {});
      }
    };
    await dropIfExists("deviceSession_1_category_1");
    await dropIfExists("deviceHash_1_category_1");

    // ==========================================
    // 🔄 STEP 6: Sync indexes
    // ==========================================
    console.log("🔄 Syncing schema indexes...");
    await Vote.syncIndexes();
    console.log("✅ Indexes synced successfully!");

    // ==========================================
    // 📊 STEP 7: Show all indexes
    // ==========================================
    const finalIndexes = await votes.indexes();
    console.log("\n📊 Active Indexes:");
    console.table(
      finalIndexes.map((i) => ({
        name: i.name,
        unique: !!i.unique,
        key: JSON.stringify(i.key),
      }))
    );

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB ✅");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing indexes:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
