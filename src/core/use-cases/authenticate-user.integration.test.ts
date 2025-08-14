import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { AuthenticateUserUseCase } from './authenticate-user'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JoseTokenGenerator } from '@/infra/cryptography/jose-token-generator'
import { hash } from 'bcryptjs'
import { db } from '@/infra/db'
import { users } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'

let usersRepository: DrizzleUsersRepository
let hasher: BcryptHasher
let tokenGenerator: JoseTokenGenerator
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    hasher = new BcryptHasher()
    tokenGenerator = new JoseTokenGenerator()
    sut = new AuthenticateUserUseCase(usersRepository, hasher, tokenGenerator)
  })

  beforeEach(async () => {
    await db.delete(users)

    const passwordHash = await hash('password123', 8)
    await db.insert(users).values({
      name: faker.person.fullName(),
      email: 'test@email.com',
      passwordHash,
    })
  })

  it('authenticates a user with valid credentials', async () => {
    const result = await sut.execute({
      email: 'test@email.com',
      password: 'password123',
    })

    expect(result.token).toEqual(expect.any(String))
    expect(result.token).not.toEqual('')
  })

  it('throws an error with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'test@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid credentials.')
  })
})
