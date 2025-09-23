import { app } from '@/main/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

describe('Register User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates a new user', async () => {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }

    const response = await request(app.server).post('/users').send(userData)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        name: userData.name,
        email: userData.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})
