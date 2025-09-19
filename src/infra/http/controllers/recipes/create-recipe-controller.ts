import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { CreateRecipeUseCase } from '@/core/use-cases/recipes/create-recipe'
import { AuthorNotFoundError } from '@/core/errors/author-not-found-error'
import { RecipePresenter } from '../../presenters/recipe-presenter'
import { CreateRecipeBody } from '../../schemas/recipe-schemas'

@injectable()
export class CreateRecipeController {
  constructor(
    @inject(CreateRecipeUseCase)
    private createRecipeUseCase: CreateRecipeUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: CreateRecipeBody }>,
    reply: FastifyReply,
  ) {
    const { title, ingredients, method } = request.body

    const authorId = request.user.sub

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
