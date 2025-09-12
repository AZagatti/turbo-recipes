import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { GetRecipeByIdUseCase } from './get-recipe-by-id'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { FakeCacheProvider } from '../_test/fake-cache-provider'

let recipesRepository: DrizzleRecipesRepository
let cacheProvider: FakeCacheProvider
let usersRepository: DrizzleUsersRepository
let sut: GetRecipeByIdUseCase

describe('Get Recipe By Id Use Case (Integration)', () => {
  beforeAll(() => {
    cacheProvider = new FakeCacheProvider()
    recipesRepository = new DrizzleRecipesRepository(cacheProvider)
    usersRepository = new DrizzleUsersRepository()
    sut = new GetRecipeByIdUseCase(recipesRepository)
  })

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
  })

  it('gets a recipe by its id from the database', async () => {
    const author = await usersRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    const createdRecipe = await recipesRepository.create({
      title: 'Bolo de Integração',
      ingredients: faker.lorem.words(10),
      method: faker.lorem.paragraphs(2),
      authorId: author.id,
    })

    const result = await sut.execute({
      recipeId: createdRecipe.id,
    })

    expect(result.recipe.id).toEqual(createdRecipe.id)
    expect(result.recipe.title).toEqual('Bolo de Integração')
    expect(result.recipe.author?.name).toEqual(author.name)
  })
})
