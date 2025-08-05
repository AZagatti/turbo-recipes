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

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  DrizzleUsersRepository,
)
container.registerSingleton<RecipesRepository>(
  'RecipesRepository',
  DrizzleRecipesRepository,
)

const hasher = new BcryptHasher()
container.registerInstance<Hasher>('Hasher', hasher)
container.registerInstance<HashComparer>('HashComparer', hasher)
container.registerSingleton<TokenGenerator>(
  'TokenGenerator',
  JoseTokenGenerator,
)
