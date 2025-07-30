import { users, recipes } from '@/infra/db/schema'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Recipe = InferSelectModel<typeof recipes>
export type NewRecipe = InferInsertModel<typeof recipes>
