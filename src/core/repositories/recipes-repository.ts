import { NewRecipe, Recipe } from '@/core/models'

export interface RecipesRepository {
  findMany(params: { page: number; limit: number }): Promise<Recipe[]>
  findById(id: number): Promise<Recipe | null>
  create(data: NewRecipe): Promise<Recipe>
  save(recipe: Recipe): Promise<void>
  delete(recipe: Recipe): Promise<void>
}
