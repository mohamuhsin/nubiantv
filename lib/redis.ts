import Redis from "ioredis";

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on("connect", () => console.log("✅ Connected to Redis"));
  redis.on("error", (err) => console.error("Redis error:", err));
} else {
  console.warn("⚠ REDIS_URL is not defined. Redis cache disabled.");
}

export default redis;
