import { NewRecipe } from '@/core/models'
import { app } from '@/main/app'
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('List Recipes (e2e)', () => {
  let token: string
  const createdRecipes: NewRecipe[] = []

  beforeAll(async () => {
    await app.ready()

    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }
    await request(app.server).post('/users').send(userData)

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: userData.email, password: userData.password })
    token = authResponse.body.token

    const recipe1 = {
      title: faker.lorem.sentence(3),
      ingredients: faker.lorem.words(5),
      method: faker.lorem.paragraph(),
    }
    const recipe2 = {
      title: faker.lorem.sentence(3),
      ingredients: faker.lorem.words(5),
      method: faker.lorem.paragraph(),
    }
    createdRecipes.push(recipe1, recipe2)

    await Promise.all(
      createdRecipes.map((recipe) =>
        request(app.server)
          .post('/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send(recipe),
      ),
    )
  })

  afterAll(async () => {
    await app.close()
  })

  it('lists all recipes', async () => {
    const listRecipesResponse = await request(app.server).get('/recipes').send()

    expect(listRecipesResponse.statusCode).toEqual(200)
    expect(listRecipesResponse.body.recipes).toHaveLength(2)
    expect(listRecipesResponse.body.recipes).toEqual(
      expect.arrayContaining([
        expect.objectContaining(createdRecipes.at(0)),
        expect.objectContaining(createdRecipes.at(1)),
      ]),
    )
  })
})
