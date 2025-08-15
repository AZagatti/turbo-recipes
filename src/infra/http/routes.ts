import { FastifyInstance } from 'fastify'
import { RegisterUserController } from './controllers/register-user-controller'
import { container } from 'tsyringe'
import { AuthenticateUserController } from './controllers/authenticate-user-controller'
import { CreateRecipeController } from './controllers/create-recipe-controller'
import { GetRecipeByIdController } from './controllers/get-recipe-by-id-controller'
import { ListRecipesController } from './controllers/list-recipes-controller'
import { UpdateRecipeController } from './controllers/update-recipe-controller'
import { DeleteRecipeController } from './controllers/delete-recipe-controller'
import { verifyJwt } from './hooks/verify-jwt'
import { GetUserProfileController } from './controllers/get-user-profile-controller'

export async function appRoutes(app: FastifyInstance) {
  const getUserProfileController = container.resolve(GetUserProfileController)
  const registerUserController = container.resolve(RegisterUserController)
  const authenticateUserController = container.resolve(
    AuthenticateUserController,
  )
  const createRecipeController = container.resolve(CreateRecipeController)
  const getRecipeByIdController = container.resolve(GetRecipeByIdController)
  const listRecipesController = container.resolve(ListRecipesController)
  const updateRecipeController = container.resolve(UpdateRecipeController)
  const deleteRecipeController = container.resolve(DeleteRecipeController)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )
  app.post('/sessions', (request, reply) =>
    authenticateUserController.handle(request, reply),
  )
  app.get('/me', { onRequest: [verifyJwt] }, (request, reply) =>
    getUserProfileController.handle(request, reply),
  )

  app.get('/recipes/:id', (request, reply) =>
    getRecipeByIdController.handle(request, reply),
  )
  app.get('/recipes', (request, reply) =>
    listRecipesController.handle(request, reply),
  )
  app.post('/recipes', { onRequest: [verifyJwt] }, (request, reply) =>
    createRecipeController.handle(request, reply),
  )
  app.patch('/recipes/:id', { onRequest: [verifyJwt] }, (request, reply) =>
    updateRecipeController.handle(request, reply),
  )
  app.delete('/recipes/:id', { onRequest: [verifyJwt] }, (request, reply) =>
    deleteRecipeController.handle(request, reply),
  )
}
