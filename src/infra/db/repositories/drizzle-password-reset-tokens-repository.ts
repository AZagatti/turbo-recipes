import { eq } from 'drizzle-orm'
import { injectable } from 'tsyringe'
import { NewPasswordResetToken, PasswordResetToken } from '@/core/models'
import { PasswordResetTokensRepository } from '@/core/repositories/password-reset-tokens-repository'
import { passwordResetTokens } from '../schema'
import { db } from '..'

@injectable()
export class DrizzlePasswordResetTokensRepository
  implements PasswordResetTokensRepository
{
  async create(data: NewPasswordResetToken): Promise<PasswordResetToken> {
    const result = await db.insert(passwordResetTokens).values(data).returning()

    return result[0]
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const result = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))

    return result[0] || null
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId))
  }
}
