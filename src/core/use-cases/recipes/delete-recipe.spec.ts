import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { makeRecipe } from '../_test/recipes-factory'
import { DeleteRecipeUseCase } from './delete-recipe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let recipesRepository: InMemoryRecipesRepository
let sut: DeleteRecipeUseCase

describe('Delete Recipe Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new DeleteRecipeUseCase(recipesRepository)

    const newRecipe = makeRecipe({ authorId: 1 })
    await recipesRepository.create(newRecipe)
  })

  it('deletes a recipe', async () => {
    await sut.execute({
      recipeId: 1,
      authorId: 1,
    })

    expect(recipesRepository.items).toHaveLength(0)
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 99,
        authorId: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('throws an error if a different user tries to delete the recipe', async () => {
    await expect(
      sut.execute({
        recipeId: 1,
        authorId: 2,
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
