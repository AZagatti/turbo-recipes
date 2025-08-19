import { Usecase } from '../usecase'
import { Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { injectable, inject } from 'tsyringe'

interface ListRecipesRequest {
  page: number
  limit: number
}

interface ListRecipesResponse {
  recipes: Recipe[]
}

@injectable()
export class ListRecipesUseCase
  implements Usecase<ListRecipesRequest, ListRecipesResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
  ) {}

  async execute({
    page,
    limit,
  }: ListRecipesRequest): Promise<ListRecipesResponse> {
    const recipes = await this.recipesRepository.findMany({ page, limit })

    return {
      recipes,
    }
  }
}
