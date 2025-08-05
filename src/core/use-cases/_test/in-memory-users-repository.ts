import { User, NewUser } from '@/core/models'
import { UsersRepository } from '@/core/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }

  async findById(id: number) {
    const user = this.items.find((item) => item.id === id)
    return user || null
  }

  async create(user: NewUser) {
    const newUser = {
      id: this.items.length + 1,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(newUser)
    return newUser
  }
}
