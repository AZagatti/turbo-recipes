import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { db } from '@/infra/db'
import { users } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'

let usersRepository: DrizzleUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  beforeEach(async () => {
    await db.delete(users)
  })

  it('gets a user profile from the database', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    const result = await sut.execute({
      userId: createdUser.id,
    })

    expect(result.user.id).toEqual(createdUser.id)
    expect(result.user.name).toEqual('John Doe')
  })
})
