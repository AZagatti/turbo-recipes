import { app } from '@/main/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

describe('Create Recipe (e2e)', () => {
  let token: string
  let userName: string
  let userId: string

  beforeAll(async () => {
    await app.ready()

    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }
    userName = userData.name

    const registerResponse = await request(app.server)
      .post('/users')
      .send(userData)
    userId = registerResponse.body.user.id

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({ email: userData.email, password: userData.password })
    token = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates a new recipe for an authenticated user', async () => {
    const recipeData = {
      title: faker.lorem.words(3),
      ingredients: faker.lorem.paragraph(),
      method: faker.lorem.paragraphs(2),
    }

    const createRecipeResponse = await request(app.server)
      .post('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData)

    expect(createRecipeResponse.statusCode).toEqual(201)
    expect(createRecipeResponse.body).toEqual({
      recipe: {
        id: expect.any(String),
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        method: recipeData.method,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        author: {
          id: userId,
          name: userName,
        },
      },
    })
  })
})
