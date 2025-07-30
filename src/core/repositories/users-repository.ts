import { User } from '../entities/user'
import { users } from '@/infra/db/schema'
import { InferInsertModel } from 'drizzle-orm'

export type NewUser = InferInsertModel<typeof users>

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: NewUser): Promise<User>
}
