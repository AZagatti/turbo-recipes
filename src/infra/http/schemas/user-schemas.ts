import { z } from 'zod'

const errorResponseSchema = z.object({
  message: z.string(),
  issues: z.any().optional(),
})

const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const createUserSchema = {
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  }),
  response: {
    201: z.object({ user: userResponseSchema }),
    400: errorResponseSchema,
    409: errorResponseSchema,
  },
}

export const authenticateUserSchema = {
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
  response: {
    200: z.object({ token: z.string() }),
    401: errorResponseSchema,
  },
}

export const forgotPasswordSchema = {
  body: z.object({
    email: z.email(),
  }),
  response: {
    204: z.null(),
    400: errorResponseSchema,
  },
}

export const resetPasswordSchema = {
  body: z.object({
    token: z.string(),
    password: z.string().min(6),
  }),
  response: {
    204: z.null(),
    400: errorResponseSchema,
  },
}

export const getUserProfileSchema = {
  response: {
    200: z.object({ user: userResponseSchema }),
    401: errorResponseSchema,
  },
}

export const updateUserProfileSchema = {
  body: z.object({
    name: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6).optional(),
  }),
  response: {
    200: z.object({ user: userResponseSchema }),
    400: errorResponseSchema,
    401: errorResponseSchema,
  },
}

export const deleteUserProfileSchema = {
  response: {
    204: z.null(),
    401: errorResponseSchema,
  },
}

export type CreateUserBody = z.infer<typeof createUserSchema.body>
export type AuthenticateUserBody = z.infer<typeof authenticateUserSchema.body>
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema.body>
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>
export type UpdateUserProfileBody = z.infer<typeof updateUserProfileSchema.body>
