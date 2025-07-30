import { hash } from 'bcryptjs'
import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Usecase } from './usecase'

export interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export interface RegisterUserResponse {
  user: User
}

export class RegisterUserUseCase
  implements Usecase<RegisterUserRequest, RegisterUserResponse>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return { user }
  }
}
