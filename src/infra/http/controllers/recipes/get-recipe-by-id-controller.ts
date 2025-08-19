import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { GetRecipeByIdUseCase } from '@/core/use-cases/recipes/get-recipe-by-id'

@injectable()
export class GetRecipeByIdController {
  constructor(
    @inject(GetRecipeByIdUseCase)
    private getRecipeByIdUseCase: GetRecipeByIdUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const getRecipeParamsSchema = z.object({
      id: z.coerce.number().int(),
    })

    const { id } = getRecipeParamsSchema.parse(request.params)

    const result = await this.getRecipeByIdUseCase.execute({
      recipeId: id,
    })

    return reply.status(200).send(result)
  }
}
