import { it, describe, expect, beforeEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { makeUser } from '../_test/users-factory'
import { InMemoryPasswordResetTokensRepository } from '../_test/in-memory-password-reset-tokens-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FakeMailProvider } from '../_test/fake-mail-provider'

let usersRepository: InMemoryUsersRepository
let passwordResetTokensRepository: InMemoryPasswordResetTokensRepository
let mailProvider: FakeMailProvider
let sut: ForgotPasswordUseCase

describe('Forgot Password Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    mailProvider = new FakeMailProvider()
    sut = new ForgotPasswordUseCase(
      usersRepository,
      passwordResetTokensRepository,
      mailProvider,
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

  it('sends a password reset link', async () => {
    const sendMailSpy = vi.spyOn(mailProvider, 'sendMail')

    await usersRepository.create(makeUser({ email: 'john.doe@email.com' }))

    await sut.execute({
      email: 'john.doe@email.com',
    })

    const tokenInDb = passwordResetTokensRepository.items[0]

    expect(sendMailSpy).toHaveBeenCalledWith({
      to: 'john.doe@email.com',
      subject: 'Recuperação de Senha',
      template: {
        name: 'forgot-password',
        payload: { token: tokenInDb.token },
      },
    })
  })
})
