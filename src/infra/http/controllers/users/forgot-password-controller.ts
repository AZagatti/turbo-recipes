import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { ForgotPasswordUseCase } from '@/core/use-cases/users/forgot-password'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@injectable()
export class ForgotPasswordController {
  constructor(
    @inject(ForgotPasswordUseCase)
    private forgotPasswordUseCase: ForgotPasswordUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const forgotPasswordBodySchema = z.object({
      email: z.email(),
    })

    const { email } = forgotPasswordBodySchema.parse(request.body)

    try {
      await this.forgotPasswordUseCase.execute({
        email,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(204).send()
      }
      throw error
    }

    return reply.status(204).send()
  }
}
