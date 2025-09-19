import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { DeleteRecipeUseCase } from '@/core/use-cases/recipes/delete-recipe'
import { DeleteRecipeParams } from '../../schemas/recipe-schemas'

@injectable()
export class DeleteRecipeController {
  constructor(
    @inject(DeleteRecipeUseCase)
    private deleteRecipeUseCase: DeleteRecipeUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Params: DeleteRecipeParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params

    const authorId = request.user.sub

    await this.deleteRecipeUseCase.execute({
      recipeId: id,
      authorId,
    })

    return reply.status(204).send()
  }
}
