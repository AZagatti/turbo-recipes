import { Recipe } from '@/core/models'

export class RecipePresenter {
  static toHTTP(recipe: Recipe) {
    return {
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      method: recipe.method,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      author: recipe.author
        ? {
            id: recipe.author.id,
            name: recipe.author.name,
          }
        : null,
    }
  }
}
