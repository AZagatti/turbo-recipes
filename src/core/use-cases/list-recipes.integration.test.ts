import { it, describe, expect, beforeAll, beforeEach } from 'vitest'
import { DrizzleRecipesRepository } from '@/infra/db/repositories/drizzle-recipes-repository'
import { DrizzleUsersRepository } from '@/infra/db/repositories/drizzle-users-repository'
import { ListRecipesUseCase } from './list-recipes'
import { db } from '@/infra/db'
import { users, recipes } from '@/infra/db/schema'
import { faker } from '@faker-js/faker'
import { createManyRecipes } from './_test/recipes-factory'

let recipesRepository: DrizzleRecipesRepository
let usersRepository: DrizzleUsersRepository
let sut: ListRecipesUseCase

describe('List Recipes Use Case (Integration)', () => {
  beforeAll(() => {
    recipesRepository = new DrizzleRecipesRepository()
    usersRepository = new DrizzleUsersRepository()
    sut = new ListRecipesUseCase(recipesRepository)
  })

  beforeEach(async () => {
    await db.delete(recipes)
    await db.delete(users)
  })

  it('lists paginated recipes from the database', async () => {
    const author = await usersRepository.create({
      name: 'John Doe',
      email: faker.internet.email(),
      passwordHash: 'hashed-password',
    })

    await createManyRecipes({
      count: 22,
      recipesRepository,
      overrideFn: (index) => ({
        title: `Receita de Integração ${index}`,
        authorId: author.id,
      }),
    })

    const result = await sut.execute({
      page: 2,
      limit: 20,
    })

    expect(result.recipes).toHaveLength(2)
    expect(result.recipes[0].title).toEqual('Receita de Integração 21')
    expect(result.recipes[0].author?.name).toEqual('John Doe')
  })
})
