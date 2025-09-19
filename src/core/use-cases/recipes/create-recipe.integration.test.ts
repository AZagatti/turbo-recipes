import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { CreateRecipeUseCase } from './create-recipe'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { FakeCacheProvider } from '../_test/fake-cache-provider'

let usersRepository: DrizzleUsersRepository
let cacheProvider: FakeCacheProvider
let recipesRepository: DrizzleRecipesRepository
let sut: CreateRecipeUseCase

describe('Create Recipe Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    usersRepository = new DrizzleUsersRepository()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    sut = new CreateRecipeUseCase(recipesRepository, usersRepository)
  })

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
  })

  it('creates a new recipe and persists it in the database', async () => {
    const authorData = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash: 'hashed-password',
      })
      .returning()

    const authorId = authorData[0].id

    const recipeData = {
      title: faker.lorem.sentence(),
      ingredients: faker.lorem.words(10),
      method: faker.lorem.paragraphs(2),
      authorId,
    }

    const result = await sut.execute(recipeData)

    expect(result.recipe.id).toEqual(expect.any(String))

    const recipeInDb = await db
      .select()
      .from(recipes)
      .where(eq(recipes.title, recipeData.title))

    expect(recipeInDb).toHaveLength(1)
    expect(recipeInDb[0].authorId).toEqual(authorId)
  })
})
