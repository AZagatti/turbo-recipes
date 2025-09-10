import { z } from 'zod'
import { errorResponseSchema } from './shared-schemas'

const authorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const recipeSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    ingredients: z.string(),
    method: z.string(),
    author: authorResponseSchema.nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .register(z.globalRegistry, { id: 'recipe', title: 'Recipe' })

export const recipeResponseSchema = z
  .object({
    recipe: recipeSchema,
  })
  .register(z.globalRegistry, {
    id: 'recipe-response',
    title: 'RecipeResponse',
  })

export const createRecipeSchema = {
  body: z.object({
    title: z.string(),
    ingredients: z.string(),
    method: z.string(),
  }),
  response: {
    201: recipeResponseSchema,
    400: errorResponseSchema.describe('Bad Request'),
    404: errorResponseSchema.describe('Not Found'),
  },
}

export const getRecipeByIdSchema = {
  params: z.object({
    id: z.coerce.number().int(),
  }),
  response: {
    200: recipeResponseSchema,
    404: errorResponseSchema.describe('Not Found'),
  },
}

export const listRecipesSchema = {
  querystring: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
  response: {
    200: z.object({
      recipes: recipeSchema.array(),
    }),
  },
}

export const searchRecipesSchema = {
  querystring: z.object({
    q: z.string(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
  response: {
    200: z.object({
      recipes: recipeSchema.array(),
    }),
  },
}

export const updateRecipeSchema = {
  params: z.object({
    id: z.coerce.number().int(),
  }),
  body: z.object({
    title: z.string().optional(),
    ingredients: z.string().optional(),
    method: z.string().optional(),
  }),
  response: {
    200: recipeResponseSchema,
    400: errorResponseSchema.describe('Bad Request'),
    403: errorResponseSchema.describe('Forbidden'),
    404: errorResponseSchema.describe('Not Found'),
  },
}

export const deleteRecipeSchema = {
  params: z.object({
    id: z.coerce.number().int(),
  }),
  response: {
    204: z.null().describe('No Content'),
    403: errorResponseSchema.describe('Forbidden'),
    404: errorResponseSchema.describe('Not Found'),
  },
}

export type CreateRecipeBody = z.infer<typeof createRecipeSchema.body>
export type GetRecipeByIdParams = z.infer<typeof getRecipeByIdSchema.params>
export type ListRecipesQuery = z.infer<typeof listRecipesSchema.querystring>
export type SearchRecipesQuery = z.infer<typeof searchRecipesSchema.querystring>
export type UpdateRecipeBody = z.infer<typeof updateRecipeSchema.body>
export type UpdateRecipeParams = z.infer<typeof updateRecipeSchema.params>
export type DeleteRecipeParams = z.infer<typeof deleteRecipeSchema.params>
