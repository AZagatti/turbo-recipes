import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { CreateRecipeController } from '../controllers/recipes/create-recipe-controller'
import { DeleteRecipeController } from '../controllers/recipes/delete-recipe-controller'
import { GetRecipeByIdController } from '../controllers/recipes/get-recipe-by-id-controller'
import { ListRecipesController } from '../controllers/recipes/list-recipes-controller'
import { SearchRecipesController } from '../controllers/recipes/search-recipes-controller'
import { UpdateRecipeController } from '../controllers/recipes/update-recipe-controller'
import { verifyJwt } from '../hooks/verify-jwt'
import {
  CreateRecipeBody,
  createRecipeSchema,
  DeleteRecipeParams,
  deleteRecipeSchema,
  GetRecipeByIdParams,
  getRecipeByIdSchema,
  ListRecipesQuery,
  listRecipesSchema,
  SearchRecipesQuery,
  searchRecipesSchema,
  UpdateRecipeBody,
  UpdateRecipeParams,
  updateRecipeSchema,
} from '../schemas/recipe-schemas'

export async function recipeRoutes(app: FastifyInstance) {
  const createRecipeController = container.resolve(CreateRecipeController)
  const getRecipeByIdController = container.resolve(GetRecipeByIdController)
  const listRecipesController = container.resolve(ListRecipesController)
  const updateRecipeController = container.resolve(UpdateRecipeController)
  const deleteRecipeController = container.resolve(DeleteRecipeController)
  const searchRecipesController = container.resolve(SearchRecipesController)

  app.get(
    '/recipes/search',
    { schema: searchRecipesSchema },
    (request, reply) =>
      searchRecipesController.handle(
        request as FastifyRequest<{ Querystring: SearchRecipesQuery }>,
        reply,
      ),
  )

  app.get('/recipes', { schema: listRecipesSchema }, (request, reply) =>
    listRecipesController.handle(
      request as FastifyRequest<{ Querystring: ListRecipesQuery }>,
      reply,
    ),
  )
  app.get('/recipes/:id', { schema: getRecipeByIdSchema }, (request, reply) =>
    getRecipeByIdController.handle(
      request as FastifyRequest<{ Params: GetRecipeByIdParams }>,
      reply,
    ),
  )

  app.post(
    '/recipes',
    { onRequest: [verifyJwt], schema: createRecipeSchema },
    (request, reply) =>
      createRecipeController.handle(
        request as FastifyRequest<{ Body: CreateRecipeBody }>,
        reply,
      ),
  )
  app.patch(
    '/recipes/:id',
    { onRequest: [verifyJwt], schema: updateRecipeSchema },
    (request, reply) =>
      updateRecipeController.handle(
        request as FastifyRequest<{
          Params: UpdateRecipeParams
          Body: UpdateRecipeBody
        }>,
        reply,
      ),
  )
  app.delete(
    '/recipes/:id',
    { onRequest: [verifyJwt], schema: deleteRecipeSchema },
    (request, reply) =>
      deleteRecipeController.handle(
        request as FastifyRequest<{ Params: DeleteRecipeParams }>,
        reply,
      ),
  )
}
