import { injectable, inject } from 'tsyringe'
import { Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { UsersRepository } from '@/core/repositories/users-repository'
import { AuthorNotFoundError } from '@/core/errors/author-not-found-error'
import { Usecase } from '../usecase'

interface CreateRecipeRequest {
  title: string
  ingredients: string
  method: string
  authorId: number
}

interface CreateRecipeResponse {
  recipe: Recipe
}

@injectable()
export class CreateRecipeUseCase
  implements Usecase<CreateRecipeRequest, CreateRecipeResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    title,
    ingredients,
    method,
    authorId,
  }: CreateRecipeRequest): Promise<CreateRecipeResponse> {
    const author = await this.usersRepository.findById(authorId)

    if (!author) {
      throw new AuthorNotFoundError()
    }
    const recipe = await this.recipesRepository.create({
      title,
      ingredients,
      method,
      authorId,
    })

    return {
      recipe,
    }
  }
}
