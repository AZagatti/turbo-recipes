import { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user: {
      sub: string
    }
  }
}

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
