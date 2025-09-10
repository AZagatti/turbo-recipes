import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { GetRecipeByIdUseCase } from '@/core/use-cases/recipes/get-recipe-by-id'
import { RecipePresenter } from '../../presenters/recipe-presenter'
import { GetRecipeByIdParams } from '../../schemas/recipe-schemas'

@injectable()
export class GetRecipeByIdController {
  constructor(
    @inject(GetRecipeByIdUseCase)
    private getRecipeByIdUseCase: GetRecipeByIdUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Params: GetRecipeByIdParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params

    const { recipe } = await this.getRecipeByIdUseCase.execute({
      recipeId: id,
    })

    return reply.status(200).send({
      recipe: RecipePresenter.toHTTP(recipe),
    })
  }
}
