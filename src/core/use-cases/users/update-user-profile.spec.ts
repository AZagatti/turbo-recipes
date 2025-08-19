import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { UpdateUserProfileUseCase } from './update-user-profile'
import { makeUser } from '../_test/users-factory'
import { FakeHasher } from '../_test/fake-hasher'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let hashComparer: FakeHasher
let sut: UpdateUserProfileUseCase

describe('Update User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    hashComparer = new FakeHasher()
    sut = new UpdateUserProfileUseCase(usersRepository, hashComparer, hasher)

    const user = makeUser({
      id: 1,
      passwordHash: 'old-password-hashed',
    })
    usersRepository.items.push(user)
  })

  it('updates the user name', async () => {
    const result = await sut.execute({
      userId: 1,
      data: { name: 'John Smith' },
    })

    expect(result.user.name).toEqual('John Smith')
    expect(usersRepository.items[0].name).toEqual('John Smith')
  })

  it('updates the user password', async () => {
    const result = await sut.execute({
      userId: 1,
      data: {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      },
    })

    expect(result.user.passwordHash).toEqual('new-password-hashed')
  })

  it('throws an error with wrong old password', async () => {
    await expect(
      sut.execute({
        userId: 1,
        data: {
          oldPassword: 'wrong-old-password',
          newPassword: 'new-password',
        },
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('throws an error if user is not found', async () => {
    await expect(
      sut.execute({
        userId: 99,
        data: { name: 'New Name' },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
