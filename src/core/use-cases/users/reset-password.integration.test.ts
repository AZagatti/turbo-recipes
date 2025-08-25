import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { db } from '@/infra/db'
import { users, passwordResetTokens } from '@/infra/db/schema'
import { DrizzlePasswordResetTokensRepository } from '@/infra/db/repositories/drizzle-password-reset-tokens-repository'
import { ResetPasswordUseCase } from './reset-password'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { makeNewUser } from '../_test/users-factory'
import { eq } from 'drizzle-orm'
import { User } from '@/core/models'
import { randomUUID } from 'node:crypto'

let usersRepository: DrizzleUsersRepository
let passwordResetTokensRepository: DrizzlePasswordResetTokensRepository
let hasher: BcryptHasher
let sut: ResetPasswordUseCase
let user: User

describe('Reset Password Use Case (Integration)', () => {
  beforeAll(() => {
    usersRepository = new DrizzleUsersRepository()
    passwordResetTokensRepository = new DrizzlePasswordResetTokensRepository()
    hasher = new BcryptHasher()
    sut = new ResetPasswordUseCase(
      passwordResetTokensRepository,
      usersRepository,
      hasher,
    )
  })

  beforeEach(async () => {
    await db.delete(passwordResetTokens)
    await db.delete(users)

    user = await usersRepository.create(
      makeNewUser({
        passwordHash: await hasher.hash('old-password'),
      }),
    )
  })

  it('resets the user password and deletes the token', async () => {
    const { token } = await passwordResetTokensRepository.create({
      token: randomUUID(),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    await sut.execute({
      token,
      password: 'new-password',
    })

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    const isNewPasswordCorrect = await hasher.compare(
      'new-password',
      updatedUser[0].passwordHash,
    )
    expect(isNewPasswordCorrect).toBe(true)

    const tokenInDb = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id))

    expect(tokenInDb).toHaveLength(0)
  })
})
