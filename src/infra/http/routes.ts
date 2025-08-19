import { FastifyInstance } from 'fastify'
import { userRoutes } from './routes/user.routes'
import { recipeRoutes } from './routes/recipe.routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes)
  app.register(recipeRoutes)
}
