import { db } from '@/infra/db'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it } from 'vitest'
import { FakeCacheProvider } from '../_test/fake-cache-provider'
import { makeRecipe } from '../_test/recipes-factory'
import { DeleteRecipeUseCase } from './delete-recipe'

let recipesRepository: DrizzleRecipesRepository
let cacheProvider: FakeCacheProvider
let usersRepository: DrizzleUsersRepository
let sut: DeleteRecipeUseCase

describe('Delete Recipe Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    usersRepository = new DrizzleUsersRepository()
    sut = new DeleteRecipeUseCase(recipesRepository)
  })

  it('deletes a recipe from the database', async () => {
    const author = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    const createdRecipe = await recipesRepository.create(
      makeRecipe({
        authorId: author.id,
      }),
    )

    await sut.execute({
      recipeId: createdRecipe.id,
      authorId: author.id,
    })

    const recipeInDb = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, createdRecipe.id))

    expect(recipeInDb).toHaveLength(0)
  })
})
