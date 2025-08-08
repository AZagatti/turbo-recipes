import { NewRecipe, Recipe } from '@/core/models'
import { RecipesRepository } from '@/core/repositories/recipes-repository'

export class InMemoryRecipesRepository implements RecipesRepository {
  public items: Recipe[] = []

  async findById(id: number) {
    const recipe = this.items.find((item) => item.id === id)
    return recipe || null
  }

  async findMany({ page, limit }: { page: number; limit: number }) {
    const recipes = this.items.slice((page - 1) * limit, page * limit)
    return recipes
  }

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

  async save(recipe: Recipe): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipe.id)

    if (itemIndex >= 0) {
      this.items[itemIndex] = recipe
    }
  }

  async delete(recipe: Recipe): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipe.id)

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1)
    }
  }
}
