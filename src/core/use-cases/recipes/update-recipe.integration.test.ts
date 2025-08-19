import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { UpdateRecipeUseCase } from './update-recipe'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { makeRecipe } from '../_test/recipes-factory'

let recipesRepository: DrizzleRecipesRepository
let usersRepository: DrizzleUsersRepository
let sut: UpdateRecipeUseCase

describe('Update Recipe Use Case (Integration)', () => {
  beforeAll(() => {
    recipesRepository = new DrizzleRecipesRepository()
    usersRepository = new DrizzleUsersRepository()
    sut = new UpdateRecipeUseCase(recipesRepository)
  })

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
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
        title: 'Título Original',
        ingredients: 'Ingredientes Originais',
      }),
    )

    await sut.execute({
      recipeId: createdRecipe.id,
      authorId: author.id,
      data: {
        title: 'Título Atualizado',
      },
    })

    const recipeInDb = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, createdRecipe.id))

    expect(recipeInDb).toHaveLength(1)
    expect(recipeInDb[0].title).toEqual('Título Atualizado')
    expect(recipeInDb[0].ingredients).toEqual('Ingredientes Originais')
  })
})
