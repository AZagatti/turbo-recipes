import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { beforeAll, describe, expect, it } from 'vitest'
import { FakeCacheProvider } from '../_test/fake-cache-provider'
import { makeRecipe } from '../_test/recipes-factory'
import { makeNewUser } from '../_test/users-factory'
import { SearchRecipesUseCase } from './search-recipes'

let recipesRepository: DrizzleRecipesRepository
let cacheProvider: FakeCacheProvider
let usersRepository: DrizzleUsersRepository
let sut: SearchRecipesUseCase

describe('Search Recipes Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    usersRepository = new DrizzleUsersRepository()
    sut = new SearchRecipesUseCase(recipesRepository)
  })

  it('finds recipes by title or ingredients and orders by relevance', async () => {
    const user = await usersRepository.create(makeNewUser())

    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Chicken Pie',
        ingredients: 'chicken, dough, catupiry',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Catupiry Savory Snack',
        ingredients: 'dough, cheese',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Chocolate Cake',
      }),
    )

    const { recipes } = await sut.execute({
      query: 'catupiry',
      page: 1,
      limit: 10,
    })

    expect(recipes).toHaveLength(2)
    expect(recipes[0].title).toEqual('Catupiry Savory Snack')
    expect(recipes[1].title).toEqual('Chicken Pie')
  })
})
