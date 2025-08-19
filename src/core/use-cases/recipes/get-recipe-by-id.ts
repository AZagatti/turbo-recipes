import { Usecase } from '../usecase'
import { Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { injectable, inject } from 'tsyringe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface GetRecipeByIdRequest {
  recipeId: number
}

interface GetRecipeByIdResponse {
  recipe: Recipe
}

@injectable()
export class GetRecipeByIdUseCase
  implements Usecase<GetRecipeByIdRequest, GetRecipeByIdResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
  ) {}

  async execute({
    recipeId,
  }: GetRecipeByIdRequest): Promise<GetRecipeByIdResponse> {
    const recipe = await this.recipesRepository.findById(recipeId)

    if (!recipe) {
      throw new ResourceNotFoundError()
    }

    return {
      recipe,
    }
  }
}
