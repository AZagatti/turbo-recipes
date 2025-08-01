import { FastifyInstance } from 'fastify'
import { RegisterUserController } from './controllers/register-user-controller'
import { container } from 'tsyringe'

export async function appRoutes(app: FastifyInstance) {
  const registerUserController = container.resolve(RegisterUserController)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )
}
