import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { NewRecipe, Recipe } from '@/core/models'
import { db } from '..'
import { recipes } from '../schema'
import { injectable } from 'tsyringe'
import { eq } from 'drizzle-orm'

@injectable()
export class DrizzleRecipesRepository implements RecipesRepository {
  async findById(id: number): Promise<Recipe | null> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id))

    return result[0] || null
  }

  async create(data: NewRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(data).returning()
    return result[0]
  }
}
