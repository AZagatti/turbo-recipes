import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { ListRecipesUseCase } from '@/core/use-cases/list-recipes'

@injectable()
export class ListRecipesController {
  constructor(
    @inject(ListRecipesUseCase)
    private listRecipesUseCase: ListRecipesUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listRecipesQuerySchema = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })

    const { page, limit } = listRecipesQuerySchema.parse(request.query)

    const result = await this.listRecipesUseCase.execute({ page, limit })

    return reply.status(200).send(result)
  }
}
