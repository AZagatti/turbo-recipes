import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Usecase } from './usecase'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { Hasher } from '../repositories/hasher'
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
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await this.hasher.hash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return { user }
  }
}
