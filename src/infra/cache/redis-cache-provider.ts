import { CacheProvider } from '@/core/contracts/cache-provider'

import { injectable } from 'tsyringe'
import { redis } from './redis'

@injectable()
export class RedisCacheProvider implements CacheProvider {
  async set(key: string, value: string, ttlInSeconds: number): Promise<void> {
    await redis.set(key, value, 'EX', ttlInSeconds)
  }

  async get(key: string): Promise<string | null> {
    return redis.get(key)
  }

  async invalidate(key: string): Promise<void> {
    await redis.del(key)
  }
}
