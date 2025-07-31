import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'
import { appRoutes } from '@/infra/http/routes'
import fastify from 'fastify'
import z, { ZodError } from 'zod'

const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})

app.listen({ port: 3333 }).then(() => {
  console.log('🚀 Server listening on port 3333')
})
