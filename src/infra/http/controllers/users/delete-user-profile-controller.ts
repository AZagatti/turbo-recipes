import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { DeleteUserProfileUseCase } from '@/core/use-cases/users/delete-user-profile'

@injectable()
export class DeleteUserProfileController {
  constructor(
    @inject(DeleteUserProfileUseCase)
    private deleteUserProfileUseCase: DeleteUserProfileUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = Number(request.user.sub)

    await this.deleteUserProfileUseCase.execute({
      userId,
    })

    return reply.status(204).send()
  }
}
