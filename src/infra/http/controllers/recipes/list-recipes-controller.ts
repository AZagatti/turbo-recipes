import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { ListRecipesUseCase } from '@/core/use-cases/recipes/list-recipes'
import { RecipePresenter } from '../../presenters/recipe-presenter'
import { ListRecipesQuery } from '../../schemas/recipe-schemas'

@injectable()
export class ListRecipesController {
  constructor(
    @inject(ListRecipesUseCase)
    private listRecipesUseCase: ListRecipesUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Querystring: ListRecipesQuery }>,
    reply: FastifyReply,
  ) {
    const { page, limit } = request.query

    const { recipes } = await this.listRecipesUseCase.execute({ page, limit })

    return reply.status(200).send({
      recipes: recipes.map(RecipePresenter.toHTTP),
    })
  }
}
