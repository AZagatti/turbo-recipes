import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { hash } from 'bcryptjs'
import { User } from '@/core/models'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase
let user: User

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)

    user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHash: await hash('password123', 6),
    })
  })

  it('gets a user profile', async () => {
    const result = await sut.execute({
      userId: user.id,
    })

    expect(result.user.id).toEqual(user.id)
    expect(result.user.name).toEqual('John Doe')
  })

  it('throws an error if user is not found', async () => {
    await expect(
      sut.execute({
        userId: 'not-found',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
