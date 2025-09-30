import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { UpdateRecipeUseCase } from './update-recipe'
import { makeRecipe } from '../_test/recipes-factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Recipe } from '@/core/models'

let recipesRepository: InMemoryRecipesRepository
let sut: UpdateRecipeUseCase
let recipe: Recipe

describe('Update Recipe Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new UpdateRecipeUseCase(recipesRepository)

    const newRecipe = makeRecipe({ authorId: 'user-1' })
    recipe = await recipesRepository.create(newRecipe)
  })

  it('updates a recipe', async () => {
    const result = await sut.execute({
      recipeId: recipe.id,
      authorId: 'user-1',
      data: {
        title: 'Carrot Cake',
      },
    })

    expect(result.recipe.title).toEqual('Carrot Cake')
    expect(recipesRepository.items[0].title).toEqual('Carrot Cake')
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 'not-found',
        authorId: 'user-1',
        data: { title: 'New Title' },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('throws an error if a different user tries to update the recipe', async () => {
    await expect(
      sut.execute({
        recipeId: recipe.id,
        authorId: 'not-found',
        data: { title: 'New Title' },
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
