import { it, describe, expect, beforeEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { makeUser } from '../_test/users-factory'
import { InMemoryPasswordResetTokensRepository } from '../_test/in-memory-password-reset-tokens-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FakeQueueProvider } from '../_test/fake-queue-provider'

let usersRepository: InMemoryUsersRepository
let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
let queueProvider: FakeQueueProvider
let sut: ForgotPasswordUseCase

describe('Forgot Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    queueProvider = new FakeQueueProvider()
    sut = new ForgotPasswordUseCase(
      usersRepository,
      passwordResetTokensRepository,
      queueProvider,
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

  it('adds a job to the queue to send a password reset link', async () => {
    const addJobSpy = vi.spyOn(queueProvider, 'add')

    await usersRepository.create(makeUser({ email: 'john.doe@email.com' }))

    await sut.execute({
      email: 'john.doe@email.com',
    })

    const tokenInDb = passwordResetTokensRepository.items[0]

    expect(addJobSpy).toHaveBeenCalledWith({
      name: 'send-forgot-password-mail',
      payload: {
        to: 'john.doe@email.com',
        subject: 'Password Recovery',
        template: {
          name: 'forgot-password',
          payload: { token: tokenInDb.token },
        },
      },
    })
  })
})
