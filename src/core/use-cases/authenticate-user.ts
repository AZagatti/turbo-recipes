import { HashComparer } from '../contracts/hash-comparer'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UsersRepository } from '../repositories/users-repository'
import { Usecase } from './usecase'

import { TokenGenerator } from '../contracts/token-generator'

export interface AuthenticateUserRequest {
  email: string
  password: string
}

export interface AuthenticateUserResponse {
  token: string
}

export class AuthenticateUserUseCase
  implements Usecase<AuthenticateUserRequest, AuthenticateUserResponse>
{
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
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
