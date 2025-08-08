import { Usecase } from './usecase'
import { RecipesRepository } from '../repositories/recipes-repository'
import { injectable, inject } from 'tsyringe'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { NotAllowedError } from '../errors/not-allowed-error'

interface DeleteRecipeRequest {
  recipeId: number
  authorId: number
}

type DeleteRecipeResponse = void

@injectable()
export class DeleteRecipeUseCase
  implements Usecase<DeleteRecipeRequest, DeleteRecipeResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
  ) {}

  async execute({
    recipeId,
    authorId,
  }: DeleteRecipeRequest): Promise<DeleteRecipeResponse> {
    const recipe = await this.recipesRepository.findById(recipeId)

    if (!recipe) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== recipe.authorId) {
      throw new NotAllowedError()
    }

    await this.recipesRepository.delete(recipe)
  }
}
