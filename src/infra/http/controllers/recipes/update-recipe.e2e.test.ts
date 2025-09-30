import { app } from '@/main/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { Recipe } from '@/core/models'

describe('Update Recipe (e2e)', () => {
  let user1Token: string
  let user2Token: string
  let recipeFromUser1: Recipe

  beforeAll(async () => {
    await app.ready()

    const user1Data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }
    const user2Data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }

    await request(app.server).post('/users').send(user1Data)
    await request(app.server).post('/users').send(user2Data)

    const authResponse1 = await request(app.server)
      .post('/sessions')
      .send({ email: user1Data.email, password: user1Data.password })
    const authResponse2 = await request(app.server)
      .post('/sessions')
      .send({ email: user2Data.email, password: user2Data.password })

    user1Token = authResponse1.body.token
    user2Token = authResponse2.body.token

    const createResponse = await request(app.server)
      .post('/recipes')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: faker.lorem.words(3),
        ingredients: faker.lorem.paragraph(),
        method: faker.lorem.paragraphs(2),
      })

    recipeFromUser1 = createResponse.body.recipe
  })

  afterAll(async () => {
    await app.close()
  })

  it('updates a recipe owned by the user', async () => {
    const updatedData = {
      title: 'Recipe Updated by Owner',
    }
    const response = await request(app.server)
      .patch(`/recipes/${recipeFromUser1.id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send(updatedData)

    expect(response.statusCode).toEqual(200)
    expect(response.body.recipe.title).toEqual(updatedData.title)
    expect(response.body.recipe.ingredients).toEqual(
      recipeFromUser1.ingredients,
    )
  })

  it('returns 403 Forbidden when updating a recipe owned by another user', async () => {
    const updatedData = {
      title: 'Attack Attempt',
    }
    const response = await request(app.server)
      .patch(`/recipes/${recipeFromUser1.id}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(updatedData)

    expect(response.statusCode).toEqual(403)
  })
})
