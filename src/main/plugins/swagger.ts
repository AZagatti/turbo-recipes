import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from 'fastify-type-provider-zod'

export const swaggerPlugin = fastifyPlugin(async (app: FastifyInstance) => {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Turbo Recipes API',
        description: 'API para o app de receitas',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  })

  app.register(scalar, {
    routePrefix: '/docs',
    configuration: {
      theme: 'fastify',
    },
  })
})
