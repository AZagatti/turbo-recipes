import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterUserUseCase } from './register-user'
import { NewUser, UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }

  async create(user: NewUser) {
    const newUser = {
      id: this.items.length + 1,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(newUser)
    return newUser
  }
}

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('registers a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'password123',
    })

    expect(result.user.id).toEqual(expect.any(Number))
    expect(result.user.name).toEqual('John Doe')
  })

  it('throws an error if email already exists', async () => {
    const existingEmail = 'john.doe@email.com'

    await sut.execute({
      name: 'John Doe',
      email: existingEmail,
      password: 'password123',
    })

    await expect(
      sut.execute({
        name: 'John Two',
        email: existingEmail,
        password: 'password456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
