import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "./redis";

export const rateLimiter = new RateLimiterRedis({
  storeClient: redis, // Redis client instance
  keyPrefix: "rl_categories", // unique prefix for this API
  points: 30, // max requests per duration
  duration: 60, // duration in seconds
  blockDuration: 60, // block IP for 60 seconds if limit exceeded
  inMemoryBlockOnConsumed: 30, // in-memory block threshold
  inMemoryBlockDuration: 60, // in-memory block duration
  // insuranceLimiter: optional fallback limiter instance
});
