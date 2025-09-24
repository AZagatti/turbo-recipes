import 'reflect-metadata'
import './container'
import '@/infra/http/schemas'

import { env } from '@/config'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'
import { appRoutes } from '@/infra/http/routes'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { redis } from '@/infra/cache/redis'
import z, { ZodError } from 'zod'
import { swaggerPlugin } from './plugins/swagger'

const app = fastify({
  logger: ['development', 'test'].includes(env.NODE_ENV)
    ? {
        transport: {
          target: 'pino-pretty',
        },
      }
    : true,
}).withTypeProvider<ZodTypeProvider>()

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  redis,
  keyGenerator: (request) => {
    return request.ip
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      ...fastifyHelmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
    },
  },
})
app.register(swaggerPlugin)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.after(() => {
  app.register(appRoutes)
})

app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message })
  }
  if (error instanceof NotAllowedError) {
    return reply.status(403).send({ message: error.message })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
