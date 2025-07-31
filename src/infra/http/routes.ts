import { FastifyInstance } from 'fastify'
import { RegisterUserController } from './controllers/register-user-controller'
import { DrizzleUsersRepository } from '../db/repositories/drizzle-users-repository'
import { RegisterUserUseCase } from '@/core/use-cases/register-user'
import { BcryptHasher } from '../cryptography/bcrypt-hasher'

export async function appRoutes(app: FastifyInstance) {
  const usersRepository = new DrizzleUsersRepository()
  const hasher = new BcryptHasher()
  const registerUserUseCase = new RegisterUserUseCase(usersRepository, hasher)
  const registerUserController = new RegisterUserController(registerUserUseCase)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )
}
