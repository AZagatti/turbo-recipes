import { container } from 'tsyringe'

import { UsersRepository } from '@/core/repositories/users-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'

import { Hasher } from '@/core/contracts/hasher'
import { HashComparer } from '@/core/contracts/hash-comparer'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

import { TokenGenerator } from '@/core/contracts/token-generator'
import { JoseTokenGenerator } from '@/infra/cryptography/jose-token-generator'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { PasswordResetTokensRepository } from '@/core/repositories/password-reset-tokens-repository'
import { DrizzlePasswordResetTokensRepository } from '@/infra/db/repositories/drizzle-password-reset-tokens-repository'
import { env } from './config'
import { MailProvider } from '@/core/contracts/mail-provider'
import { ResendMailProvider } from '@/infra/mail/resend-mail-provider'
import { LogMailProvider } from '@/infra/mail/log-mail-provider'
import { QueueProvider } from '@/core/contracts/queue-provider'
import { BullmqQueueProvider } from '@/infra/queue/bullmq-queue-provider'
import { CacheProvider } from '@/core/contracts/cache-provider'
import { RedisCacheProvider } from '@/infra/cache/redis-cache-provider'

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  DrizzleUsersRepository,
)
container.registerSingleton<RecipesRepository>(
  'RecipesRepository',
  DrizzleRecipesRepository,
)

container.registerSingleton<PasswordResetTokensRepository>(
  'PasswordResetTokensRepository',
  DrizzlePasswordResetTokensRepository,
)

const hasher = new BcryptHasher()
container.registerInstance<Hasher>('Hasher', hasher)
container.registerInstance<HashComparer>('HashComparer', hasher)
container.registerSingleton<TokenGenerator>(
  'TokenGenerator',
  JoseTokenGenerator,
)

container.registerSingleton<QueueProvider>('QueueProvider', BullmqQueueProvider)

if (env.NODE_ENV === 'production') {
  container.registerSingleton<MailProvider>('MailProvider', ResendMailProvider)
} else {
  container.registerSingleton<MailProvider>('MailProvider', LogMailProvider)
}

container.registerSingleton<CacheProvider>('CacheProvider', RedisCacheProvider)
