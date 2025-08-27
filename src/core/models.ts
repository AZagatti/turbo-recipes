import { users, recipes, passwordResetTokens } from '@/infra/db/schema'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type Recipe = Omit<
  InferSelectModel<typeof recipes>,
  'searchableText'
> & {
  author?: Pick<User, 'id' | 'name'> | null
}
export type NewRecipe = InferInsertModel<typeof recipes>

export type PasswordResetToken = InferSelectModel<typeof passwordResetTokens>
export type NewPasswordResetToken = InferInsertModel<typeof passwordResetTokens>
