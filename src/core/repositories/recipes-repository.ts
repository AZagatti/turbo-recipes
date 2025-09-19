import { NewRecipe, Recipe } from '@/core/models'

export interface RecipesRepository {
  findMany(params: { page: number; limit: number }): Promise<Recipe[]>
  findById(id: string): Promise<Recipe | null>
  create(data: NewRecipe): Promise<Recipe>
  save(recipe: Recipe): Promise<void>
  delete(recipe: Recipe): Promise<void>
  searchMany(params: {
    query: string
    page: number
    limit: number
  }): Promise<Recipe[]>
}
