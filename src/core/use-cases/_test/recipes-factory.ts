import { faker } from '@faker-js/faker'
import { NewRecipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'

export function makeRecipe(override: Partial<NewRecipe> = {}): NewRecipe {
  return {
    title: faker.lorem.sentence(),
    ingredients: faker.lorem.words(10),
    method: faker.lorem.paragraphs(2),
    authorId: faker.string.uuid(),
    ...override,
  }
}

type OverrideFn = (index: number) => Partial<NewRecipe>

export async function createManyRecipes({
  count,
  recipesRepository,
  overrideFn,
}: {
  count: number
  recipesRepository: RecipesRepository
  overrideFn?: OverrideFn
}) {
  for (let i = 1; i <= count; i++) {
    const override = overrideFn ? overrideFn(i) : {}
    await recipesRepository.create(makeRecipe(override))
  }
}
