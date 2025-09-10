import { SearchRecipesUseCase } from '@/core/use-cases/recipes/search-recipes'
import { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { RecipePresenter } from '../../presenters/recipe-presenter'
import { SearchRecipesQuery } from '../../schemas/recipe-schemas'

@injectable()
export class SearchRecipesController {
  constructor(
    @inject(SearchRecipesUseCase)
    private searchRecipesUseCase: SearchRecipesUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Querystring: SearchRecipesQuery }>,
    reply: FastifyReply,
  ) {
    const { q, page, limit } = request.query

    const { recipes } = await this.searchRecipesUseCase.execute({
      query: q,
      page,
      limit,
    })

    return reply.status(200).send({
      recipes: recipes.map(RecipePresenter.toHTTP),
    })
  }
}
