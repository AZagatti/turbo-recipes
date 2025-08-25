import { db } from '@/infra/db'
import { DrizzlePasswordResetTokensRepository } from '@/infra/db/repositories/drizzle-password-reset-tokens-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { passwordResetTokens, users } from '@/infra/db/schema'
import { LogMailProvider } from '@/infra/mail/log-mail-provider'
import { eq } from 'drizzle-orm'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { makeNewUser } from '../_test/users-factory'
import { ForgotPasswordUseCase } from './forgot-password'

let usersRepository: DrizzleUsersRepository
let passwordResetTokensRepository: DrizzlePasswordResetTokensRepository
let mailProvider: LogMailProvider
let sut: ForgotPasswordUseCase

describe('Forgot Password Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    passwordResetTokensRepository = new DrizzlePasswordResetTokensRepository()
    mailProvider = new LogMailProvider()
    sut = new ForgotPasswordUseCase(
      usersRepository,
      passwordResetTokensRepository,
      mailProvider,
    )
  })

  beforeEach(async () => {
    await db.delete(passwordResetTokens)
    await db.delete(users)
  })

  it('creates a password reset token and persists it in the database', async () => {
    const user = await usersRepository.create(
      makeNewUser({ email: 'john.doe@email.com' }),
    )

    await sut.execute({
      email: 'john.doe@email.com',
    })

    const tokenInDb = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id))

    expect(tokenInDb).toHaveLength(1)
    expect(tokenInDb[0].userId).toEqual(user.id)
    expect(tokenInDb[0].token).toEqual(expect.any(String))
  })
})
