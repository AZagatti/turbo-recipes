import { NewRecipe, Recipe } from '@/core/models'

export interface RecipesRepository {
  create(data: NewRecipe): Promise<Recipe>
}
