import { env } from '@/config'
import Redis from 'ioredis'

export const redis = new Redis(env.REDIS_URL, {
  connectTimeout: 500,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
})
