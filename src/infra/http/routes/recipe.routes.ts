import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { CreateRecipeController } from '../controllers/recipes/create-recipe-controller'
import { GetRecipeByIdController } from '../controllers/recipes/get-recipe-by-id-controller'
import { ListRecipesController } from '../controllers/recipes/list-recipes-controller'
import { UpdateRecipeController } from '../controllers/recipes/update-recipe-controller'
import { DeleteRecipeController } from '../controllers/recipes/delete-recipe-controller'
import { verifyJwt } from '../hooks/verify-jwt'

export async function recipeRoutes(app: FastifyInstance) {
  const createRecipeController = container.resolve(CreateRecipeController)
  const getRecipeByIdController = container.resolve(GetRecipeByIdController)
  const listRecipesController = container.resolve(ListRecipesController)
  const updateRecipeController = container.resolve(UpdateRecipeController)
  const deleteRecipeController = container.resolve(DeleteRecipeController)

  app.get('/recipes', (request, reply) =>
    listRecipesController.handle(request, reply),
  )
  app.get('/recipes/:id', (request, reply) =>
    getRecipeByIdController.handle(request, reply),
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
