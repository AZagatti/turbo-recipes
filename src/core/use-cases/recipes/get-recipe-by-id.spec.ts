import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { GetRecipeByIdUseCase } from './get-recipe-by-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InMemoryUsersRepository } from '../_test/in-memory-users-repository'

let recipesRepository: InMemoryRecipesRepository
let usersRepository: InMemoryUsersRepository
let sut: GetRecipeByIdUseCase

describe('Get Recipe By Id Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetRecipeByIdUseCase(recipesRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHash: 'hashed-password',
    })
    await recipesRepository.create({
      title: 'Bolo de Chocolate',
      ingredients: 'Farinha, ovos, chocolate',
      method: 'Misture tudo e asse.',
      authorId: 1,
    })
  })

  it('gets a recipe by its id', async () => {
    const result = await sut.execute({
      recipeId: 1,
    })

    expect(result.recipe.id).toEqual(1)
    expect(result.recipe.title).toEqual('Bolo de Chocolate')
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 99,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
