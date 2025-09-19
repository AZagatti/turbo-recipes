import { it, describe, expect, beforeAll } from 'vitest'
import { RegisterUserUseCase } from './register-user'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { db } from '@/infra/db'
import { users } from '@/infra/db/schema'
import { eq } from 'drizzle-orm'
import { faker } from '@faker-js/faker'
import { beforeEach } from 'node:test'

let usersRepository: DrizzleUsersRepository
let hasher: BcryptHasher
let sut: RegisterUserUseCase

describe('Register User Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    hasher = new BcryptHasher()
    sut = new RegisterUserUseCase(usersRepository, hasher)
  })

  beforeEach(async () => {
    await db.delete(users)
  })

  it('creates a new user and persists it in the database', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const result = await sut.execute(userData)

    expect(result.user.id).toEqual(expect.any(String))

    const userInDb = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))

    expect(userInDb).toHaveLength(1)
    expect(userInDb[0].name).toEqual(userData.name)
  })
})
