import { app } from '@/main/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

describe('Authenticate User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('authenticates with valid credentials', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    await request(app.server).post('/users').send(userData)

    const response = await request(app.server).post('/sessions').send({
      email: userData.email,
      password: userData.password,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
