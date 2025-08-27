import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { SearchRecipesUseCase } from '@/core/use-cases/recipes/search-recipes'
import { RecipePresenter } from '../../presenters/recipe-presenter'

@injectable()
export class SearchRecipesController {
  constructor(
    @inject(SearchRecipesUseCase)
    private searchRecipesUseCase: SearchRecipesUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const searchQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })

    const { q, page, limit } = searchQuerySchema.parse(request.query)

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
