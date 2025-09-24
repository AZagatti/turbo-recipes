import 'reflect-metadata'
import { beforeAll } from 'vitest'
import { db } from './src/infra/db'
import { redis } from './src/infra/cache/redis'
import { sql } from 'drizzle-orm'

beforeAll(async () => {
  if (process.env.TEST_ENV === 'e2e') {
    console.log('🧹 Cleaning up database and cache for E2E test file...')
    await redis.flushdb()
    await db.execute(
      sql`TRUNCATE TABLE "users", "recipes", "password_reset_tokens" RESTART IDENTITY CASCADE;`,
    )
  }
})
