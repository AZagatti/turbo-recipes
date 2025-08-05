import { FastifyInstance } from 'fastify'
import { RegisterUserController } from './controllers/register-user-controller'
import { container } from 'tsyringe'
import { AuthenticateUserController } from './controllers/authenticate-user-controller'
import { CreateRecipeController } from './controllers/create-recipe-controller'

export async function appRoutes(app: FastifyInstance) {
  const registerUserController = container.resolve(RegisterUserController)
  const authenticateUserController = container.resolve(
    AuthenticateUserController,
  )
  const createRecipeController = container.resolve(CreateRecipeController)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )

  app.post('/sessions', (request, reply) =>
    authenticateUserController.handle(request, reply),
  )

  app.post('/recipes', (request, reply) =>
    createRecipeController.handle(request, reply),
  )
}
