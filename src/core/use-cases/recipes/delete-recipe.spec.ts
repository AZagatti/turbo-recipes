import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { makeRecipe } from '../_test/recipes-factory'
import { DeleteRecipeUseCase } from './delete-recipe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Recipe } from '@/core/models'

let recipesRepository: InMemoryRecipesRepository
let sut: DeleteRecipeUseCase
let recipe: Recipe

describe('Delete Recipe Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new DeleteRecipeUseCase(recipesRepository)

    const newRecipe = makeRecipe({ authorId: 'user-1' })
    recipe = await recipesRepository.create(newRecipe)
  })

  it('deletes a recipe', async () => {
    await sut.execute({
      recipeId: recipe.id,
      authorId: 'user-1',
    })

    expect(recipesRepository.items).toHaveLength(0)
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 'not-found',
        authorId: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('throws an error if a different user tries to delete the recipe', async () => {
    await expect(
      sut.execute({
        recipeId: recipe.id,
        authorId: 'not-found',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
