import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { UpdateRecipeUseCase } from '@/core/use-cases/recipes/update-recipe'
import { RecipePresenter } from '../../presenters/recipe-presenter'

@injectable()
export class UpdateRecipeController {
  constructor(
    @inject(UpdateRecipeUseCase)
    private updateRecipeUseCase: UpdateRecipeUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const updateRecipeParamsSchema = z.object({
      id: z.coerce.number().int(),
    })
    const updateRecipeBodySchema = z.object({
      title: z.string().optional(),
      ingredients: z.string().optional(),
      method: z.string().optional(),
    })

    const { id } = updateRecipeParamsSchema.parse(request.params)
    const data = updateRecipeBodySchema.parse(request.body)

    const authorId = Number(request.user.sub)

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
