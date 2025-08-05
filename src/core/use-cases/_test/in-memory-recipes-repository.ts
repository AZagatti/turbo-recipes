import { NewRecipe, Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'

export class InMemoryRecipesRepository implements RecipesRepository {
  public items: Recipe[] = []

  async create(data: NewRecipe): Promise<Recipe> {
    const newRecipe = {
      id: this.items.length + 1,
      title: data.title,
      ingredients: data.ingredients,
      method: data.method,
      authorId: data.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(newRecipe)

    return newRecipe
  }
}
