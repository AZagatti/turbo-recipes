import { it, describe, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { InMemoryPasswordResetTokensRepository } from '../_test/in-memory-password-reset-tokens-repository'
import { ResetPasswordUseCase } from './reset-password'
import { FakeHasher } from '../_test/fake-hasher'
import { makeUser } from '../_test/users-factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
let hasher: FakeHasher
let sut: ResetPasswordUseCase

describe('Reset Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    hasher = new FakeHasher()
    sut = new ResetPasswordUseCase(
      passwordResetTokensRepository,
      usersRepository,
      hasher,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resets the user password with a valid token', async () => {
    const user = await usersRepository.create(makeUser())
    await passwordResetTokensRepository.create({
      token: 'valid-token',
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    await sut.execute({
      token: 'valid-token',
      password: 'new-password',
    })

    const updatedUser = await usersRepository.findById(user.id)
    const isNewPasswordCorrect = await hasher.compare(
      'new-password',
      updatedUser!.passwordHash,
    )

    expect(isNewPasswordCorrect).toBe(true)
    expect(passwordResetTokensRepository.items).toHaveLength(0)
  })

  it('throws an error if token is not found', async () => {
    await expect(
      sut.execute({
        token: 'invalid-token',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('throws an error if token is expired', async () => {
    const user = await usersRepository.create(makeUser())
    await passwordResetTokensRepository.create({
      token: 'expired-token',
      userId: user.id,
      expiresAt: new Date(Date.now() - 1000 * 60),
    })

    vi.advanceTimersByTime(1000 * 60 * 2)

    await expect(
      sut.execute({
        token: 'expired-token',
        password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
