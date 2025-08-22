import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { makeUser } from '../_test/users-factory'
import { InMemoryPasswordResetTokensRepository } from '../_test/in-memory-password-reset-tokens-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
let sut: ForgotPasswordUseCase

describe('Forgot Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    sut = new ForgotPasswordUseCase(
      usersRepository,
      passwordResetTokensRepository,
    )
  })

  it('create a password reset token if user exists', async () => {
    const createdUser = await usersRepository.create(
      makeUser({ email: 'john.doe@email.com' }),
    )

    await sut.execute({
      email: 'john.doe@email.com',
    })

    expect(passwordResetTokensRepository.items).toHaveLength(1)
    expect(passwordResetTokensRepository.items[0].userId).toBe(createdUser.id)
  })

  it('not create a password reset token if user does not exist', async () => {
    await expect(
      sut.execute({
        email: 'non.existent@email.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
