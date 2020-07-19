import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import cacheConfig from '@config/redis';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: cacheConfig.config.redis.host,
  port: cacheConfig.config.redis.port,
  password: cacheConfig.config.redis.password || undefined,
});

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rateLimiterRedis.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppError('Too many requests.', 429);
  }
}
