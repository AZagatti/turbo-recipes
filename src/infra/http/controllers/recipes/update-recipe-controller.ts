import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { UpdateRecipeUseCase } from '@/core/use-cases/recipes/update-recipe'
import { RecipePresenter } from '../../presenters/recipe-presenter'
import {
  UpdateRecipeBody,
  UpdateRecipeParams,
} from '../../schemas/recipe-schemas'

@injectable()
export class UpdateRecipeController {
  constructor(
    @inject(UpdateRecipeUseCase)
    private updateRecipeUseCase: UpdateRecipeUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{
      Params: UpdateRecipeParams
      Body: UpdateRecipeBody
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params
    const data = request.body

    const authorId = request.user.sub

    const { recipe } = await this.updateRecipeUseCase.execute({
      recipeId: id,
      authorId,
      data,
    })

    return reply.status(200).send({
      recipe: RecipePresenter.toHTTP(recipe),
    })
  }
}
