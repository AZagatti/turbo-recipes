import { Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { injectable, inject } from 'tsyringe'
import { Usecase } from '../usecase'

interface SearchRecipesRequest {
  query: string
  page: number
  limit: number
}

interface SearchRecipesResponse {
  recipes: Recipe[]
}

@injectable()
export class SearchRecipesUseCase
  implements Usecase<SearchRecipesRequest, SearchRecipesResponse>
{
  constructor(
    @inject('RecipesRepository')
    private recipesRepository: RecipesRepository,
  ) {}

  async execute({
    query,
    page,
    limit,
  }: SearchRecipesRequest): Promise<SearchRecipesResponse> {
    const recipes = await this.recipesRepository.searchMany({
      query,
      page,
      limit,
    })

    return { recipes }
  }
}
