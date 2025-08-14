import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from './_test/in-memory-recipes-repository'
import { UpdateRecipeUseCase } from './update-recipe'
import { makeRecipe } from './_test/recipes-factory'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'

let recipesRepository: InMemoryRecipesRepository
let sut: UpdateRecipeUseCase

describe('Update Recipe Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new UpdateRecipeUseCase(recipesRepository)

    const newRecipe = makeRecipe({ authorId: 1 })
    await recipesRepository.create(newRecipe)
  })

  it('updates a recipe', async () => {
    const result = await sut.execute({
      recipeId: 1,
      authorId: 1,
      data: {
        title: 'Bolo de Cenoura Melhorado',
      },
    })

    expect(result.recipe.title).toEqual('Bolo de Cenoura Melhorado')
    expect(recipesRepository.items[0].title).toEqual(
      'Bolo de Cenoura Melhorado',
    )
  })

  it('throws an error if recipe is not found', async () => {
    await expect(
      sut.execute({
        recipeId: 99,
        authorId: 1,
        data: { title: 'Novo Título' },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('throws an error if a different user tries to update the recipe', async () => {
    await expect(
      sut.execute({
        recipeId: 1,
        authorId: 2,
        data: { title: 'Novo Título' },
      }),
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
