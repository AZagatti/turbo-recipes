import { User } from '../entities/user'
import { NewUser } from '../models'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
  create(user: NewUser): Promise<User>
}
