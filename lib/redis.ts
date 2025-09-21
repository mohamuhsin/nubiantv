import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      console.warn("⚠️ REDIS_URL not set. Redis features disabled.");
      return null;
    }
    redis = new Redis(process.env.REDIS_URL);
    redis.on("connect", () => console.log("✅ Connected to Redis"));
    redis.on("error", (err) => console.error("Redis error:", err));
  }
  return redis;
}
