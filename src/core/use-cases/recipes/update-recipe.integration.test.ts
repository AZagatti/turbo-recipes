import { db } from '@/infra/db'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it } from 'vitest'
import { FakeCacheProvider } from '../_test/fake-cache-provider'
import { makeRecipe } from '../_test/recipes-factory'
import { UpdateRecipeUseCase } from './update-recipe'

let recipesRepository: DrizzleRecipesRepository
let cacheProvider: FakeCacheProvider
let usersRepository: DrizzleUsersRepository
let sut: UpdateRecipeUseCase

describe('Update Recipe Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    usersRepository = new DrizzleUsersRepository()
    sut = new UpdateRecipeUseCase(recipesRepository)
  })

  it('updates a recipe in the database', async () => {
    const author = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    const createdRecipe = await recipesRepository.create(
      makeRecipe({
        authorId: author.id,
        title: 'Original Title',
        ingredients: 'Original Ingredients',
      }),
    )

    await sut.execute({
      recipeId: createdRecipe.id,
      authorId: author.id,
      data: {
        title: 'Updated Title',
      },
    })

    const recipeInDb = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, createdRecipe.id))

    expect(recipeInDb).toHaveLength(1)
    expect(recipeInDb[0].title).toEqual('Updated Title')
    expect(recipeInDb[0].ingredients).toEqual('Original Ingredients')
  })
})
