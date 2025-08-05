import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { NewRecipe, Recipe } from '@/core/models'
import { db } from '..'
import { recipes } from '../schema'
import { injectable } from 'tsyringe'

@injectable()
export class DrizzleRecipesRepository implements RecipesRepository {
  async create(data: NewRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(data).returning()
    return result[0]
  }
}
