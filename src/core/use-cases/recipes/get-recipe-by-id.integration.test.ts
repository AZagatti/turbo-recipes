import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from 'vitest'
import { FakeCacheProvider } from '../_test/fake-cache-provider'
import { GetRecipeByIdUseCase } from './get-recipe-by-id'

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

  it('gets a recipe by its id from the database', async () => {
    const author = await usersRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    const createdRecipe = await recipesRepository.create({
      title: 'Chocolate Cake',
      ingredients: faker.lorem.words(10),
      method: faker.lorem.paragraphs(2),
      authorId: author.id,
    })

    const result = await sut.execute({
      recipeId: createdRecipe.id,
    })

    expect(result.recipe.id).toEqual(createdRecipe.id)
    expect(result.recipe.title).toEqual('Chocolate Cake')
    expect(result.recipe.author?.name).toEqual(author.name)
  })
})
