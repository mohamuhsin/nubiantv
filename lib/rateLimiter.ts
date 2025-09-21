import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRedis } from "./redis";

export function getRateLimiter(
  prefix: string,
  points = 30,
  duration = 60
): RateLimiterRedis | null {
  const redis = getRedis();
  if (!redis) return null;

  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: prefix,
    points,
    duration,
    blockDuration: duration,
    inMemoryBlockOnConsumed: points,
    inMemoryBlockDuration: duration,
  });
}
