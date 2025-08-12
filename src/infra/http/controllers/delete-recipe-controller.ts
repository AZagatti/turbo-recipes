import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { DeleteRecipeUseCase } from '@/core/use-cases/delete-recipe'

@injectable()
export class DeleteRecipeController {
  constructor(
    @inject(DeleteRecipeUseCase)
    private deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const deleteRecipeParamsSchema = z.object({
      id: z.coerce.number().int(),
    })

    const { id } = deleteRecipeParamsSchema.parse(request.params)

    const authorId = Number(request.user.sub)

    await this.deleteRecipeUseCase.execute({
      recipeId: id,
      authorId,
    })

    return reply.status(204).send()
  }
}
