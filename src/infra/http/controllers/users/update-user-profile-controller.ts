import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { UpdateUserProfileUseCase } from '@/core/use-cases/users/update-user-profile'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'

@injectable()
export class UpdateUserProfileController {
  constructor(
    @inject(UpdateUserProfileUseCase)
    private updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const updateUserBodySchema = z.object({
      name: z.string().optional(),
      oldPassword: z.string().optional(),
      newPassword: z.string().min(6).optional(),
    })

    const data = updateUserBodySchema.parse(request.body)
    const userId = Number(request.user.sub)

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
