import { RecipesRepository } from '@/core/repositories/recipes-repository'
import { NewRecipe, Recipe } from '@/core/models'
import { db } from '..'
import { recipes, users } from '../schema'
import { inject, injectable } from 'tsyringe'
import { desc, eq, sql } from 'drizzle-orm'
import { CacheProvider } from '@/core/contracts/cache-provider'

@injectable()
export class DrizzleRecipesRepository implements RecipesRepository {
  constructor(
    @inject('CacheProvider')
    private cache: CacheProvider,
  ) {}

  async findMany({
    page,
    limit,
  }: {
    page: number
    limit: number
  }): Promise<Recipe[]> {
    const cacheKey = `recipes:page:${page}:limit:${limit}`

    const cachedRecipes = await this.cache.get(cacheKey)

    if (cachedRecipes) {
      return JSON.parse(cachedRecipes)
    }

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

    await this.cache.set(cacheKey, JSON.stringify(recipesList), 120)

    return recipesList
  }

  async findById(id: string): Promise<Recipe | null> {
    const cacheKey = `recipe:${id}`

    const cachedRecipe = await this.cache.get(cacheKey)

    if (cachedRecipe) {
      return JSON.parse(cachedRecipe)
    }

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

    if (!recipe) {
      return null
    }

    await this.cache.set(cacheKey, JSON.stringify(recipe), 300)

    return recipe
  }

  async create(data: NewRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(data).returning({
      id: recipes.id,
    })

    const recipeWithAuthor = await this.findById(newRecipe.id)

    if (!recipeWithAuthor) {
      throw new Error('Failed to fetch newly created recipe.')
    }

    return recipeWithAuthor
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

    const cacheKey = `recipe:${recipe.id}`
    await this.cache.invalidate(cacheKey)
  }

  async delete(recipe: Recipe): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, recipe.id))

    const cacheKey = `recipe:${recipe.id}`
    await this.cache.invalidate(cacheKey)
  }

  async searchMany({
    query,
    page,
    limit,
  }: {
    query: string
    page: number
    limit: number
  }): Promise<Recipe[]> {
    const formattedQuery = query.trim().split(/\s+/).join(' & ')

    const searchQuery = sql`to_tsquery('portuguese', ${formattedQuery})`

    const foundRecipes = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        ingredients: recipes.ingredients,
        method: recipes.method,
        authorId: recipes.authorId,
        createdAt: recipes.createdAt,
        updatedAt: recipes.updatedAt,
        searchableText: recipes.searchableText,
        author: {
          id: users.id,
          name: users.name,
        },
      })
      .from(recipes)
      .innerJoin(users, eq(recipes.authorId, users.id))
      .where(sql`${recipes.searchableText} @@ ${searchQuery}`)
      .orderBy(desc(sql`ts_rank(${recipes.searchableText}, ${searchQuery})`))
      .limit(limit)
      .offset((page - 1) * limit)

    return foundRecipes
  }
}
