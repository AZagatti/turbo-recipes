import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { UpdateUserProfileUseCase } from './update-user-profile'
import { db } from '@/infra/db'
import { users } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { eq } from 'drizzle-orm'
import { User } from '@/core/models'

let usersRepository: DrizzleUsersRepository
let hasher: BcryptHasher
let sut: UpdateUserProfileUseCase
let user: User

describe('Update User Profile Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    hasher = new BcryptHasher()
    sut = new UpdateUserProfileUseCase(usersRepository, hasher, hasher)
  })

  beforeEach(async () => {
    user = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: await hasher.hash('old-password'),
    })
  })

  it('updates a user name in the database', async () => {
    await sut.execute({
      userId: user.id,
      data: {
        name: 'Jane Doe',
      },
    })

    const userInDb = await db.select().from(users).where(eq(users.id, user.id))

    expect(userInDb[0].name).toEqual('Jane Doe')
  })

  it('updates a user password in the database', async () => {
    await sut.execute({
      userId: user.id,
      data: {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      },
    })

    const userInDb = await db.select().from(users).where(eq(users.id, user.id))

    const isNewPasswordValid = await hasher.compare(
      'new-password',
      userInDb[0].passwordHash,
    )

    expect(isNewPasswordValid).toBe(true)
  })
})
