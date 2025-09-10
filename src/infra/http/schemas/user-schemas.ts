import { z } from 'zod'
import { errorResponseSchema } from './shared-schemas'

export const userSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .register(z.globalRegistry, { id: 'user-schema', title: 'User' })

export const userResponseSchema = z
  .object({
    user: userSchema,
  })
  .register(z.globalRegistry, {
    id: 'user-response-schema',
    title: 'UserResponse',
  })

export const createUserSchema = {
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  }),
  response: {
    201: userResponseSchema,
    400: errorResponseSchema.describe('Bad Request'),
    409: errorResponseSchema.describe('Conflict'),
  },
}

export const authenticateUserSchema = {
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
  response: {
    200: z.object({ token: z.string() }),
    401: errorResponseSchema.describe('Unauthorized'),
  },
}

export const forgotPasswordSchema = {
  body: z.object({
    email: z.email(),
  }),
  response: {
    204: z.null().describe('No Content'),
    400: errorResponseSchema.describe('Bad Request'),
  },
}

export const resetPasswordSchema = {
  body: z.object({
    token: z.string(),
    password: z.string().min(6),
  }),
  response: {
    204: z.null().describe('No Content'),
    400: errorResponseSchema.describe('Bad Request'),
  },
}

export const getUserProfileSchema = {
  response: {
    200: userResponseSchema,
    401: errorResponseSchema.describe('Unauthorized'),
  },
}

export const updateUserProfileSchema = {
  body: z.object({
    name: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6).optional(),
  }),
  response: {
    200: userResponseSchema,
    400: errorResponseSchema.describe('Bad Request'),
    401: errorResponseSchema.describe('Unauthorized'),
  },
}

export const deleteUserProfileSchema = {
  response: {
    204: z.null().describe('No Content'),
    401: errorResponseSchema.describe('Unauthorized'),
  },
}

export type CreateUserBody = z.infer<typeof createUserSchema.body>
export type AuthenticateUserBody = z.infer<typeof authenticateUserSchema.body>
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema.body>
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>
export type UpdateUserProfileBody = z.infer<typeof updateUserProfileSchema.body>
