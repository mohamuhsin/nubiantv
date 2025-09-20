import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "./redis";

export const rateLimiter = redis
  ? new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: "rl_categories",
      points: 30, // max 30 votes
      duration: 60, // per 60 seconds
      blockDuration: 60, // block for 60 seconds if limit exceeded
      inMemoryBlockOnConsumed: 30,
      inMemoryBlockDuration: 60,
    })
  : null; // fallback: no limiter
