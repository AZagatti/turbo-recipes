import 'reflect-metadata'
import { beforeAll, vi } from 'vitest'
import { db } from './src/infra/db'
import { redis } from './src/infra/cache/redis'
import { sql } from 'drizzle-orm'

vi.mock('./src/infra/cache/redis', () =>
  process.env.TEST_ENV === 'unit'
    ? { redis: {} }
    : vi.importActual('./src/infra/cache/redis'),
)

beforeAll(async () => {
  if (process.env.TEST_ENV !== 'unit') {
    console.log('🧹 Cleaning up database and cache for DB test file...')
    await redis.flushdb()
    await db.execute(
      sql`TRUNCATE TABLE "users", "recipes", "password_reset_tokens" RESTART IDENTITY CASCADE;`,
    )
  }
})
