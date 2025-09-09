import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUserUseCase } from '@/core/use-cases/users/register-user'
import { inject, injectable } from 'tsyringe'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { CreateUserBody } from '../../schemas/user-schemas'

@injectable()
export class RegisterUserController {
  constructor(
    @inject(RegisterUserUseCase)
    private registerUserUseCase: RegisterUserUseCase,
  ) {}

  async handle(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply,
  ) {
    const { name, email, password } = request.body

    const result = await this.registerUserUseCase.execute({
      name,
      email,
      password,
    })

    const user = UserPresenter.toHTTP(result.user)

    return reply.status(201).send({ user })
  }
}
