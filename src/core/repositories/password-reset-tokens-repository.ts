import { NewPasswordResetToken, PasswordResetToken } from '../models'

export interface PasswordResetTokensRepository {
  create(data: NewPasswordResetToken): Promise<PasswordResetToken>
  findByToken(token: string): Promise<PasswordResetToken | null>
  deleteByUserId(userId: number): Promise<void>
}
