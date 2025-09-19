import 'reflect-metadata'
import './container'
import '@/infra/http/schemas'

import { env } from '@/config'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'
import { appRoutes } from '@/infra/http/routes'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import Redis from 'ioredis'
import z, { ZodError } from 'zod'
import { swaggerPlugin } from './plugins/swagger'
import fastifyHelmet from '@fastify/helmet'
import { setupGracefulShutdown } from './shutdown'
import { connection } from '@/infra/db/index.js'
import cluster from 'cluster'
import { cpus } from 'os'

const numCPUS = cpus().length

if (cluster.isPrimary) {
  console.info(`Primary ${process.pid} is running`)

  for (let i = 0; i < numCPUS; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `Worker ${worker.process.pid} died - "${code} ${signal}". Forking another one...`,
    )
    cluster.fork()
  })

  const shutdownPrimary = () => {
    console.log('Shutting down primary process...')
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill()
    }
    process.exit(0)
  }

  process.on('SIGINT', shutdownPrimary)
  process.on('SIGTERM', shutdownPrimary)
} else {
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

  const redis = new Redis(env.REDIS_URL, {
    connectTimeout: 500,
    maxRetriesPerRequest: 3,
  })

  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
    keyGenerator: (request) => {
      return request.ip
    },
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyHelmet)

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

    app.log.error(error)

    return reply.status(500).send({ message: 'Internal server error.' })
  })

  app.listen({ port: env.PORT, host: env.HOST }).then(() => {
    app.log.info(
      `🚀 Worker ${process.pid} started and listening on http://${env.HOST}:${env.PORT}`,
    )
  })

  setupGracefulShutdown(app, connection)
}

if (env.RUN_WORKER_IN_API) {
  import('./worker.js')
}
