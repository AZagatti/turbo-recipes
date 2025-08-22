import { Hasher } from '@/core/contracts/hasher'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UsersRepository } from '@/core/repositories/users-repository'
import { PasswordResetTokensRepository } from '@/core/repositories/password-reset-tokens-repository'
import { injectable, inject } from 'tsyringe'
import { Usecase } from '../usecase'

interface ResetPasswordRequest {
  token: string
  password: string
}

type ResetPasswordResponse = void

@injectable()
export class ResetPasswordUseCase
  implements Usecase<ResetPasswordRequest, ResetPasswordResponse>
{
  constructor(
    @inject('PasswordResetTokensRepository')
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hasher: Hasher,
  ) {}

  async execute({
    token,
    password,
  }: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const passwordResetToken =
      await this.passwordResetTokensRepository.findByToken(token)

    if (!passwordResetToken) {
      throw new ResourceNotFoundError()
    }

    const isTokenExpired = new Date() > passwordResetToken.expiresAt
    if (isTokenExpired) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(passwordResetToken.userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.passwordHash = await this.hasher.hash(password)
    user.updatedAt = new Date()

    await this.usersRepository.save(user)
    await this.passwordResetTokensRepository.deleteByUserId(user.id)
  }
}
