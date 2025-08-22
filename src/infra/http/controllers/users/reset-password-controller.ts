import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { ResetPasswordUseCase } from '@/core/use-cases/users/reset-password'

@injectable()
export class ResetPasswordController {
  constructor(
    @inject(ResetPasswordUseCase)
    private resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const resetPasswordBodySchema = z.object({
      token: z.string(),
      password: z.string().min(6),
    })

    const { token, password } = resetPasswordBodySchema.parse(request.body)

    await this.resetPasswordUseCase.execute({
      token,
      password,
    })

    return reply.status(204).send()
  }
}
