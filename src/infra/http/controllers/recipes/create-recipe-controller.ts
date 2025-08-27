import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { CreateRecipeUseCase } from '@/core/use-cases/recipes/create-recipe'
import { AuthorNotFoundError } from '@/core/errors/author-not-found-error'
import { RecipePresenter } from '../../presenters/recipe-presenter'

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

    const authorId = Number(request.user.sub)

    try {
      const { recipe } = await this.createRecipeUseCase.execute({
        title,
        ingredients,
        method,
        authorId,
      })

      return reply.status(201).send({
        recipe: RecipePresenter.toHTTP(recipe),
      })
    } catch (error) {
      if (error instanceof AuthorNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }

      throw error
    }
  }
}
