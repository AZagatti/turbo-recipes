import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { GetRecipeByIdUseCase } from './get-recipe-by-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'
import { Recipe } from '@/core/models'

let recipesRepository: InMemoryRecipesRepository
let usersRepository: InMemoryUsersRepository
let sut: GetRecipeByIdUseCase
let recipe: Recipe

describe('Get Recipe By Id Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetRecipeByIdUseCase(recipesRepository)

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHash: 'hashed-password',
    })
    recipe = await recipesRepository.create({
      title: 'Bolo de Chocolate',
      ingredients: 'Farinha, ovos, chocolate',
      method: 'Misture tudo e asse.',
      authorId: user.id,
    })
  })

  it('gets a recipe by its id', async () => {
    const result = await sut.execute({
      recipeId: recipe.id,
    })

    expect(result.recipe.title).toEqual('Bolo de Chocolate')
    expect(result.recipe.method).toEqual('Misture tudo e asse.')
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 'not-found',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
