import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { GetUserProfileUseCase } from '@/core/use-cases/get-user-profile'
import { UserPresenter } from '../presenters/user-presenter'

@injectable()
export class GetUserProfileController {
  constructor(
    @inject(GetUserProfileUseCase)
    private getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = Number(request.user.sub)

    const result = await this.getUserProfileUseCase.execute({
      userId,
    })

    const user = UserPresenter.toHTTP(result.user)

    return reply.status(200).send({ user })
  }
}
