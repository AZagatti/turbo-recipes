import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { AuthenticateUserUseCase } from '@/core/use-cases/users/authenticate-user'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { AuthenticateUserBody } from '../../schemas/user-schemas'

@injectable()
export class AuthenticateUserController {
  constructor(
    @inject(AuthenticateUserUseCase)
    private authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: AuthenticateUserBody }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body

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
