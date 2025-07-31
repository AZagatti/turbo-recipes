import { beforeEach, describe, expect, it } from 'vitest'
import { HashComparer } from '../contracts/hash-comparer'
import { TokenGenerator } from '../contracts/token-generator'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { InMemoryUsersRepository } from './_test/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'

class FakeHashComparer implements HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return `${plain}-hashed` === hash
  }
}

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
    hashComparer = new FakeHashComparer()
    tokenGenerator = new FakeTokenGenerator()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      hashComparer,
      tokenGenerator,
    )

    usersRepository.items.push({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHash: 'password123-hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
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
