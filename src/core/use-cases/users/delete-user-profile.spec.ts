import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { DeleteUserProfileUseCase } from './delete-user-profile'
import { makeUser } from '../_test/users-factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserProfileUseCase

describe('Delete User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserProfileUseCase(usersRepository)

    const user = makeUser({ id: 'user-1' })
    usersRepository.items.push(user)
  })

  it('deletes a user profile', async () => {
    await sut.execute({
      userId: 'user-1',
    })

    expect(usersRepository.items).toHaveLength(0)
  })

  it('throws an error if user is not found', async () => {
    await expect(
      sut.execute({
        userId: 'not-found',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
