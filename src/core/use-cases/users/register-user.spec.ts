import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'
import { FakeHasher } from '../_test/fake-hasher'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { RegisterUserUseCase } from './register-user'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(usersRepository, fakeHasher)
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
