import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { DeleteRecipeUseCase } from './delete-recipe'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { makeRecipe } from '../_test/recipes-factory'
import { eq } from 'drizzle-orm'

let recipesRepository: DrizzleRecipesRepository
let usersRepository: DrizzleUsersRepository
let sut: DeleteRecipeUseCase

describe('Delete Recipe Use Case (Integration)', () => {
  beforeAll(() => {
    recipesRepository = new DrizzleRecipesRepository()
    usersRepository = new DrizzleUsersRepository()
    sut = new DeleteRecipeUseCase(recipesRepository)
  })

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
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
