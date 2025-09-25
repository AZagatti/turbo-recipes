import { app } from '@/main/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { Recipe } from '@/core/models'

describe('Get Recipe By Id (e2e)', () => {
  let token: string
  let createdRecipe: Recipe

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

    const recipeData = {
      title: faker.lorem.words(3),
      ingredients: faker.lorem.paragraph(),
      method: faker.lorem.paragraphs(2),
    }

    const createResponse = await request(app.server)
      .post('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData)

    createdRecipe = createResponse.body.recipe
  })

  afterAll(async () => {
    await app.close()
  })

  it('gets a specific recipe by its ID', async () => {
    const response = await request(app.server)
      .get(`/recipes/${createdRecipe.id}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.recipe.title).toEqual(createdRecipe.title)
    expect(response.body.recipe.id).toEqual(createdRecipe.id)
    expect(response.body.recipe.author.id).toEqual(createdRecipe.author!.id)
  })

  it('returns 404 for a non-existing recipe ID', async () => {
    const nonExistingId = faker.string.uuid()
    const response = await request(app.server)
      .get(`/recipes/${nonExistingId}`)
      .send()

    expect(response.statusCode).toEqual(404)
  })
})
