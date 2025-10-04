// lib/db.ts
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend global to persist connection across hot reloads in dev
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env");
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined, // optional, if you set it
    });
  }

  try {
    cached.conn = await cached.promise;
    globalThis.mongoose = cached;

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Connected to MongoDB");
    }

    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}
