import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  RESEND_API_KEY: z.string(),
  MAIL_FROM: z.email(),
  REDIS_URL: z.url(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', z.treeifyError(_env.error))
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
