import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUserUseCase } from '@/core/use-cases/register-user'
import { inject, injectable } from 'tsyringe'
import { UserPresenter } from '../presenters/user-presenter'

@injectable()
export class RegisterUserController {
  constructor(
    @inject(RegisterUserUseCase)
    private registerUserUseCase: RegisterUserUseCase,
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    const result = await this.registerUserUseCase.execute({
      name,
      email,
      password,
    })

    const user = UserPresenter.toHTTP(result.user)

    return reply.status(201).send({ user })
  }
}
