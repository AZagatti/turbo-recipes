import { FastifyRequest, FastifyReply } from 'fastify'
import { inject, injectable } from 'tsyringe'
import { UpdateUserProfileUseCase } from '@/core/use-cases/users/update-user-profile'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { UpdateUserProfileBody } from '../../schemas/user-schemas'

@injectable()
export class UpdateUserProfileController {
  constructor(
    @inject(UpdateUserProfileUseCase)
    private updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: UpdateUserProfileBody }>,
    reply: FastifyReply,
  ) {
    const data = request.body
    const userId = request.user.sub

    try {
      const result = await this.updateUserProfileUseCase.execute({
        userId,
        data,
      })

      const user = UserPresenter.toHTTP(result.user)

      return reply.status(200).send({ user })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message })
      }
      throw error
    }
  }
}
