import { UsersRepository } from '@/core/repositories/users-repository'
import { NewUser, User } from '@/core/models'
import { db } from '..'
import { users } from '../schema'
import { eq } from 'drizzle-orm'

export class DrizzleUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email))
    return result[0] || null
  }

  async create(data: NewUser): Promise<User> {
    const result = await db.insert(users).values(data).returning()
    return result[0]
  }
}
