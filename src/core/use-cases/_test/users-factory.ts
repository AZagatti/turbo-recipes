import { faker } from '@faker-js/faker'
import { NewUser, User } from '@/core/models'

export function makeUser(override: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  }
}

export function makeNewUser(override: Partial<NewUser> = {}): NewUser {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: 'hashed-password',
    ...override,
  }
}
