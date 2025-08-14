import { it, describe, expect, beforeAll } from 'vitest'
import { RegisterUserUseCase } from './register-user'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { db } from '@/infra/db'
import { users } from '@/infra/db/schema'
import { eq } from 'drizzle-orm'

let usersRepository: DrizzleUsersRepository
let hasher: BcryptHasher
let sut: RegisterUserUseCase

describe('Register User Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    hasher = new BcryptHasher()
    sut = new RegisterUserUseCase(usersRepository, hasher)
  })

  it('creates a new user and persists it in the database', async () => {
    const userEmail = 'integration.test@email.com'

    const result = await sut.execute({
      name: 'Integration Test User',
      email: userEmail,
      password: 'password123',
    })

    expect(result.user.id).toEqual(expect.any(Number))

    const userInDb = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))

    expect(userInDb).toHaveLength(1)
    expect(userInDb[0].name).toEqual('Integration Test User')
  })
})
