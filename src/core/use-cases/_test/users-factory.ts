import { faker } from '@faker-js/faker'
import { User } from '@/core/models'

export function makeUser(override: Partial<User> = {}): User {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  }
}
