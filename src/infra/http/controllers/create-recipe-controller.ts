import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { CreateRecipeUseCase } from '@/core/use-cases/create-recipe'
import { AuthorNotFoundError } from '@/core/errors/author-not-found-error'

@injectable()
export class CreateRecipeController {
  constructor(
    @inject(CreateRecipeUseCase)
    private createRecipeUseCase: CreateRecipeUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createRecipeBodySchema = z.object({
      title: z.string(),
      ingredients: z.string(),
      method: z.string(),
    })

    const { title, ingredients, method } = createRecipeBodySchema.parse(
      request.body,
    )

    const authorId = 1

    try {
      const result = await this.createRecipeUseCase.execute({
        title,
        ingredients,
        method,
        authorId,
      })

      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof AuthorNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }

      throw error
    }
  }
}
