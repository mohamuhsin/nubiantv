// lib/redis.ts
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in .env");
}

const redis = new Redis(process.env.REDIS_URL); // now TS knows it's defined

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
