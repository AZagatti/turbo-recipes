import { CacheProvider } from '@/core/contracts/cache-provider'
import Redis from 'ioredis'
import { env } from '@/config'
import { injectable } from 'tsyringe'

@injectable()
export class RedisCacheProvider implements CacheProvider {
  private redis: Redis

  constructor() {
    this.redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 500,
    })
  }

  async set(key: string, value: string, ttlInSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlInSeconds)
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async invalidate(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
