import z from 'zod'

export const errorResponseSchema = z
  .object({
    message: z.string(),
    issues: z.any().optional(),
  })
  .register(z.globalRegistry, {
    id: 'error-response',
    title: 'Error',
  })
