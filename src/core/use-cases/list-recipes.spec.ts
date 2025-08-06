import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryRecipesRepository } from './_test/in-memory-recipes-repository'
import { ListRecipesUseCase } from './list-recipes'
import { createManyRecipes } from './_test/recipes-factory'

let recipesRepository: InMemoryRecipesRepository
let sut: ListRecipesUseCase

describe('List Recipes Use Case', () => {
  beforeEach(async () => {
    recipesRepository = new InMemoryRecipesRepository()
    sut = new ListRecipesUseCase(recipesRepository)
  })

  it('lists all recipes on the first page', async () => {
    await createManyRecipes({
      count: 22,
      recipesRepository,
      overrideFn: (index) => ({ title: `Receita ${index}` }),
    })

    const result = await sut.execute({
      page: 1,
      limit: 20,
    })

    expect(result.recipes).toHaveLength(20)
    expect(result.recipes[0].title).toEqual('Receita 1')
  })

  it('lists recipes on the second page', async () => {
    await createManyRecipes({
      count: 22,
      recipesRepository,
      overrideFn: (index) => ({ title: `Receita ${index}` }),
    })

    const result = await sut.execute({
      page: 2,
      limit: 20,
    })

    expect(result.recipes).toHaveLength(2)
    expect(result.recipes[0].title).toEqual('Receita 21')
    expect(result.recipes[1].title).toEqual('Receita 22')
  })
})
