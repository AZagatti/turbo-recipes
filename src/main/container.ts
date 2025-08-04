import { container } from 'tsyringe'

import { UsersRepository } from '@/core/repositories/users-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'

import { Hasher } from '@/core/contracts/hasher'
import { HashComparer } from '@/core/contracts/hash-comparer'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'

import { TokenGenerator } from '@/core/contracts/token-generator'
import { JoseTokenGenerator } from '@/infra/cryptography/jose-token-generator'

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  DrizzleUsersRepository,
)

const hasher = new BcryptHasher()
container.registerInstance<Hasher>('Hasher', hasher)
container.registerInstance<HashComparer>('HashComparer', hasher)
container.registerSingleton<TokenGenerator>(
  'TokenGenerator',
  JoseTokenGenerator,
)
