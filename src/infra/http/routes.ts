import { FastifyInstance } from 'fastify'
import { RegisterUserController } from './controllers/register-user-controller'
import { container } from 'tsyringe'
import { AuthenticateUserController } from './controllers/authenticate-user-controller'
import { CreateRecipeController } from './controllers/create-recipe-controller'
import { GetRecipeByIdController } from './controllers/get-recipe-by-id-controller'
import { ListRecipesController } from './controllers/list-recipes-controller'

export async function appRoutes(app: FastifyInstance) {
  const registerUserController = container.resolve(RegisterUserController)
  const authenticateUserController = container.resolve(
    AuthenticateUserController,
  )
  const createRecipeController = container.resolve(CreateRecipeController)
  const getRecipeByIdController = container.resolve(GetRecipeByIdController)
  const listRecipesController = container.resolve(ListRecipesController)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )

  app.post('/sessions', (request, reply) =>
    authenticateUserController.handle(request, reply),
  )

  app.post('/recipes', (request, reply) =>
    createRecipeController.handle(request, reply),
  )
  app.get('/recipes/:id', (request, reply) =>
    getRecipeByIdController.handle(request, reply),
  )
  app.get('/recipes', (request, reply) =>
    listRecipesController.handle(request, reply),
  )
}
