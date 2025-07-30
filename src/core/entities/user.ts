import { users } from '@/infra/db/schema'
import { InferSelectModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
