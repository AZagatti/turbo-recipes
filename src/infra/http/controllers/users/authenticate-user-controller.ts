import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { AuthenticateUserUseCase } from '@/core/use-cases/users/authenticate-user'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'

@injectable()
export class AuthenticateUserController {
  constructor(
    @inject(AuthenticateUserUseCase)
    private authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
      email: z.email(),
      password: z.string(),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
      const result = await this.authenticateUserUseCase.execute({
        email,
        password,
      })

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message })
      }
      throw error
    }
  }
}
