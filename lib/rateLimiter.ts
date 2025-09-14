import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "./redis";

export const rateLimiter = redis
  ? new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: "rl_categories",
      points: 30,
      duration: 60,
      blockDuration: 60,
      inMemoryBlockOnConsumed: 30,
      inMemoryBlockDuration: 60,
    })
  : null; // fallback: no limiter
