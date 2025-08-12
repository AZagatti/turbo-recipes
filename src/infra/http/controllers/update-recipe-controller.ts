import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { UpdateRecipeUseCase } from '@/core/use-cases/update-recipe'

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

    const result = await this.updateRecipeUseCase.execute({
      recipeId: id,
      authorId,
      data,
    })

    return reply.status(200).send(result)
  }
}
