import { NewRecipe, Recipe } from '@/core/models'

export interface RecipesRepository {
  findById(id: number): Promise<Recipe | null>
  create(data: NewRecipe): Promise<Recipe>
}
