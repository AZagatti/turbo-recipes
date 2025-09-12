import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { SearchRecipesUseCase } from './search-recipes'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { makeNewUser } from '../_test/users-factory'
import { makeRecipe } from '../_test/recipes-factory'
import { FakeCacheProvider } from '../_test/fake-cache-provider'

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

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
  })

  it('finds recipes by title or ingredients and orders by relevance', async () => {
    const user = await usersRepository.create(makeNewUser())

    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Torta de Frango',
        ingredients: 'frango, massa, catupiry',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Salgado de Catupiry',
        ingredients: 'massa, queijo',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        authorId: user.id,
        title: 'Bolo de Chocolate',
      }),
    )

    const { recipes } = await sut.execute({
      query: 'catupiry',
      page: 1,
      limit: 10,
    })

    expect(recipes).toHaveLength(2)
    expect(recipes[0].title).toEqual('Salgado de Catupiry')
    expect(recipes[1].title).toEqual('Torta de Frango')
  })
})
