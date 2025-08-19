import { HashComparer } from '@/core/contracts/hash-comparer'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { UsersRepository } from '@/core/repositories/users-repository'
import { Usecase } from '../usecase'

import { TokenGenerator } from '@/core/contracts/token-generator'
import { inject, injectable } from 'tsyringe'

export interface AuthenticateUserRequest {
  email: string
  password: string
}

export interface AuthenticateUserResponse {
  token: string
}

@injectable()
export class AuthenticateUserUseCase
  implements Usecase<AuthenticateUserRequest, AuthenticateUserResponse>
{
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('HashComparer')
    private hashComparer: HashComparer,
    @inject('TokenGenerator')
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const token = await this.tokenGenerator.generate({
      sub: user.id.toString(),
    })

    return { token }
  }
}
