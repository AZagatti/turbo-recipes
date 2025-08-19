import { injectable, inject } from 'tsyringe'
import { Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Usecase } from '../usecase'

interface UpdateRecipeRequest {
  recipeId: number
  authorId: number
  data: {
    title?: string
    ingredients?: string
    method?: string
  }
}

interface UpdateRecipeResponse {
  recipe: Recipe
}

@injectable()
export class UpdateRecipeUseCase
  implements Usecase<UpdateRecipeRequest, UpdateRecipeResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
  ) {}

  async execute({
    recipeId,
    authorId,
    data,
  }: UpdateRecipeRequest): Promise<UpdateRecipeResponse> {
    const recipe = await this.recipesRepository.findById(recipeId)

    if (!recipe) {
      throw new ResourceNotFoundError()
    }

    if (authorId !== recipe.authorId) {
      throw new NotAllowedError()
    }

    recipe.title = data.title ?? recipe.title
    recipe.ingredients = data.ingredients ?? recipe.ingredients
    recipe.method = data.method ?? recipe.method

    recipe.updatedAt = new Date()

    await this.recipesRepository.save(recipe)

    return {
      recipe,
    }
  }
}
