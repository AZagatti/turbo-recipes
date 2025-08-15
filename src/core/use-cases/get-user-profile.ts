import { Usecase } from './usecase'
import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { injectable, inject } from 'tsyringe'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileRequest {
  userId: number
}

interface GetUserProfileResponse {
  user: User
}

@injectable()
export class GetUserProfileUseCase
  implements Usecase<GetUserProfileRequest, GetUserProfileResponse>
{
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
