import 'reflect-metadata'
import './container'
import '@/infra/http/schemas'
import fastify from 'fastify'
import z, { ZodError } from 'zod'
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'
import { appRoutes } from '@/infra/http/routes'
import { env } from '@/config'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import fastifyJwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify({
  logger:
    env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
          },
        }
      : true,
}).withTypeProvider<ZodTypeProvider>()

export type ZodServer = typeof app

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(swagger, {
  openapi: {
    info: {
      title: 'Turbo Recipes API',
      description: 'API for recipe application',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
  transformObject: jsonSchemaTransformObject,
})

app.register(scalar, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})

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

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  console.log(`🚀 Server listening on http://${env.HOST}:${env.PORT}`)
})

if (env.RUN_WORKER_IN_API) {
  import('./worker.js')
}
