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
        title: 'Chocolate Cake',
        ingredients: 'eggs, flour, chocolate sprinkles, cocoa powder',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        title: 'Chicken Pie with Cream Cheese',
        ingredients: 'shredded chicken, pie crust, cream cheese',
      }),
    )
    await recipesRepository.create(
      makeRecipe({
        title: 'Dark Chocolate Mousse',
        ingredients: 'chocolate powder, heavy cream',
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
      query: 'cream cheese',
      page: 1,
      limit: 10,
    })

    expect(recipes).toHaveLength(1)
    expect(recipes[0].title).toContain('Chicken Pie')
  })

  it('returns a paginated list of recipes', async () => {
    await recipesRepository.create(
      makeRecipe({ title: 'Chocolate Brigadeiro' }),
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
