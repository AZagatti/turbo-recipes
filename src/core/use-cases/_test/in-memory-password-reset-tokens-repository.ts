import { NewPasswordResetToken, PasswordResetToken } from '@/core/models'
import { PasswordResetTokensRepository } from '@/core/repositories/password-reset-tokens-repository'
import { randomInt } from 'node:crypto'

export class InMemoryPasswordResetTokensRepository
  implements PasswordResetTokensRepository
{
  public items: PasswordResetToken[] = []

  async create(data: NewPasswordResetToken): Promise<PasswordResetToken> {
    const passwordResetToken = {
      id: randomInt(1, 100),
      token: data.token,
      userId: data.userId,
      expiresAt: data.expiresAt,
    }

    this.items.push(passwordResetToken)

    return passwordResetToken
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = this.items.find((item) => item.token === token)
    return passwordResetToken || null
  }

  async deleteByUserId(userId: number): Promise<void> {
    this.items = this.items.filter((item) => item.userId !== userId)
  }
}
