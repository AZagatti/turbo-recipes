import { z } from 'zod'

const errorResponseSchema = z.object({
  message: z.string(),
  issues: z.any().optional(),
})

const authorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const recipeResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  ingredients: z.string(),
  method: z.string(),
  author: authorResponseSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createRecipeSchema = {
  body: z.object({
    title: z.string(),
    ingredients: z.string(),
    method: z.string(),
  }),
  response: {
    201: z.object({ recipe: recipeResponseSchema }),
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export const getRecipeByIdSchema = {
  params: z.object({
    id: z.coerce.number().int(),
  }),
  response: {
    200: z.object({ recipe: recipeResponseSchema }),
    404: errorResponseSchema,
  },
}

export const listRecipesSchema = {
  querystring: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
  response: {
    200: z.object({
      recipes: z.array(recipeResponseSchema),
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
      recipes: z.array(recipeResponseSchema),
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
    200: z.object({ recipe: recipeResponseSchema }),
    400: errorResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export const deleteRecipeSchema = {
  params: z.object({
    id: z.coerce.number().int(),
  }),
  response: {
    204: z.null(),
    403: errorResponseSchema,
    404: errorResponseSchema,
  },
}

export type CreateRecipeBody = z.infer<typeof createRecipeSchema.body>
export type GetRecipeByIdParams = z.infer<typeof getRecipeByIdSchema.params>
export type ListRecipesQuery = z.infer<typeof listRecipesSchema.querystring>
export type SearchRecipesQuery = z.infer<typeof searchRecipesSchema.querystring>
export type UpdateRecipeBody = z.infer<typeof updateRecipeSchema.body>
export type UpdateRecipeParams = z.infer<typeof updateRecipeSchema.params>
export type DeleteRecipeParams = z.infer<typeof deleteRecipeSchema.params>
