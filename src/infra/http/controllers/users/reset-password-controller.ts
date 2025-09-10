import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { ResetPasswordUseCase } from '@/core/use-cases/users/reset-password'
import { ResetPasswordBody } from '../../schemas/user-schemas'

@injectable()
export class ResetPasswordController {
  constructor(
    @inject(ResetPasswordUseCase)
    private resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: ResetPasswordBody }>,
    reply: FastifyReply,
  ) {
    const { token, password } = request.body

    await this.resetPasswordUseCase.execute({
      token,
      password,
    })

    return reply.status(204).send()
  }
}
