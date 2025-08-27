import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from '../_test/in-memory-recipes-repository'
import { makeRecipe } from '../_test/recipes-factory'
import { SearchRecipesUseCase } from './search-recipes'

let recipesRepository: InMemoryRecipesRepository
let sut: SearchRecipesUseCase

describe('Search Recipes Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new SearchRecipesUseCase(recipesRepository)

    await recipesRepository.create(
      makeRecipe({
        title: 'Bolo de Chocolate Formigueiro',
        ingredients: 'ovos, farinha, chocolate granulado',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        title: 'Torta de Frango com Requeijão',
        ingredients: 'frango desfiado, massa podre, requeijão',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        title: 'Mousse de Chocolate Amargo',
        ingredients: 'chocolate em pó, creme de leite',
      }),
    )
  })

  it('finds recipes by title', async () => {
    const { recipes } = await sut.execute({
      query: 'chocolate',
      page: 1,
      limit: 10,
    })

    expect(recipes).toHaveLength(2)
    expect(recipes[0].title).toContain('Chocolate')
    expect(recipes[1].title).toContain('Chocolate')
  })

  it('finds recipes by ingredients', async () => {
    const { recipes } = await sut.execute({
      query: 'requeijão',
      page: 1,
      limit: 10,
    })

    expect(recipes).toHaveLength(1)
    expect(recipes[0].title).toContain('Torta de Frango')
  })

  it('returns a paginated list of recipes', async () => {
    await recipesRepository.create(
      makeRecipe({ title: 'Brigadeiro de Chocolate' }),
    )

    const { recipes } = await sut.execute({
      query: 'chocolate',
      page: 2,
      limit: 2,
    })

    expect(recipes).toHaveLength(1)
    expect(recipes[0].title).toContain('Brigadeiro')
  })
})
