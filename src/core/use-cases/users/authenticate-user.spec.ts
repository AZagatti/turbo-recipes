import { beforeEach, describe, expect, it } from 'vitest'
import { HashComparer } from '@/core/contracts/hash-comparer'
import { TokenGenerator } from '@/core/contracts/token-generator'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeHasher } from '../_test/fake-hasher'
import { makeUser } from '../_test/users-factory'

class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: { sub: string }): Promise<string> {
    return `fake-token-for-user-${payload.sub}`
  }
}

let usersRepository: InMemoryUsersRepository
let hashComparer: HashComparer
let tokenGenerator: TokenGenerator
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashComparer = new FakeHasher()
    tokenGenerator = new FakeTokenGenerator()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      hashComparer,
      tokenGenerator,
    )

    const user = makeUser({
      id: 1,
      email: 'john.doe@email.com',
      passwordHash: 'password123-hashed',
    })
    usersRepository.items.push(user)
  })

  it('authenticates a user with valid credentials', async () => {
    const result = await sut.execute({
      email: 'john.doe@email.com',
      password: 'password123',
    })

    expect(result.token).toEqual(
      expect.stringMatching(/^fake-token-for-user-\d+$/),
    )
  })

  it('throws an error with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong-email@email.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('throws an error with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'john.doe@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
