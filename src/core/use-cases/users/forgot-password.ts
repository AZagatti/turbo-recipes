import { UsersRepository } from '@/core/repositories/users-repository'
import { PasswordResetTokensRepository } from '@/core/repositories/password-reset-tokens-repository'
import { injectable, inject } from 'tsyringe'
import { Usecase } from '../usecase'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { randomUUID } from 'node:crypto'

interface ForgotPasswordRequest {
  email: string
}

type ForgotPasswordResponse = void

@injectable()
export class ForgotPasswordUseCase
  implements Usecase<ForgotPasswordRequest, ForgotPasswordResponse>
{
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('PasswordResetTokensRepository')
    private passwordResetTokensRepository: PasswordResetTokensRepository,
  ) {}

  async execute({
    email,
  }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.passwordResetTokensRepository.deleteByUserId(user.id)

    const token = randomUUID()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await this.passwordResetTokensRepository.create({
      token,
      userId: user.id,
      expiresAt,
    })
  }
}
