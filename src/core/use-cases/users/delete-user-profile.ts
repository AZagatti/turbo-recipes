import { Usecase } from '../usecase'
import { UsersRepository } from '@/core/repositories/users-repository'
import { injectable, inject } from 'tsyringe'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteUserProfileRequest {
  userId: number
}

type DeleteUserProfileResponse = void

@injectable()
export class DeleteUserProfileUseCase
  implements Usecase<DeleteUserProfileRequest, DeleteUserProfileResponse>
{
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: DeleteUserProfileRequest): Promise<DeleteUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.delete(user)
  }
}
