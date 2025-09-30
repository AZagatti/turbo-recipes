import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { FakeCacheProvider } from '../_test/fake-cache-provider'
import { createManyRecipes } from '../_test/recipes-factory'
import { ListRecipesUseCase } from './list-recipes'

let recipesRepository: DrizzleRecipesRepository
let usersRepository: DrizzleUsersRepository
let cacheProvider: FakeCacheProvider
let sut: ListRecipesUseCase

describe('List Recipes Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    usersRepository = new DrizzleUsersRepository()
    sut = new ListRecipesUseCase(recipesRepository)
  })

  it('lists paginated recipes from the database', async () => {
    const author = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    await createManyRecipes({
      count: 22,
      recipesRepository,
      overrideFn: (index) => ({
        title: `Integration Recipe ${index}`,
        authorId: author.id,
      }),
    })

    const result = await sut.execute({
      page: 2,
      limit: 20,
    })

    expect(result.recipes).toHaveLength(2)
    expect(result.recipes[0].title).toEqual('Integration Recipe 2')
    expect(result.recipes[1].title).toEqual('Integration Recipe 1')
    expect(result.recipes[0].author?.name).toEqual('John Doe')
  })
})
