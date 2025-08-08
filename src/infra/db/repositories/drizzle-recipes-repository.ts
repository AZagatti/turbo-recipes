import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { NewRecipe, Recipe } from '@/core/models'
import { db } from '..'
import { recipes } from '../schema'
import { injectable } from 'tsyringe'
import { eq } from 'drizzle-orm'

@injectable()
export class DrizzleRecipesRepository implements RecipesRepository {
  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<Recipe[]> {
    const recipesList = await db.query.recipes.findMany({
      limit,
      offset: (page - 1) * limit,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    })

    return recipesList
  }

  async findById(id: number): Promise<Recipe | null> {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    })

    return recipe || null
  }

  async create(data: NewRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(data).returning()
    return result[0]
  }

  async save(recipe: Recipe): Promise<void> {
    await db
      .update(recipes)
      .set({
        title: recipe.title,
        ingredients: recipe.ingredients,
        method: recipe.method,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, recipe.id))
  }

  async delete(recipe: Recipe): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, recipe.id))
  }
}
