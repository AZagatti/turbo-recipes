import { Usecase } from '../usecase'
import { User } from '@/core/models'
import { UsersRepository } from '@/core/repositories/users-repository'
import { injectable, inject } from 'tsyringe'
import { HashComparer } from '@/core/contracts/hash-comparer'
import { Hasher } from '@/core/contracts/hasher'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface UpdateUserProfileRequest {
  userId: number
  data: {
    name?: string
    oldPassword?: string
    newPassword?: string
  }
}

interface UpdateUserProfileResponse {
  user: User
}

@injectable()
export class UpdateUserProfileUseCase
  implements Usecase<UpdateUserProfileRequest, UpdateUserProfileResponse>
{
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('HashComparer')
    private hashComparer: HashComparer,
    @inject('Hasher')
    private hasher: Hasher,
  ) {}

  async execute({
    userId,
    data,
  }: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (data.newPassword && data.oldPassword) {
      const isOldPasswordValid = await this.hashComparer.compare(
        data.oldPassword,
        user.passwordHash,
      )

      if (!isOldPasswordValid) {
        throw new InvalidCredentialsError()
      }

      user.passwordHash = await this.hasher.hash(data.newPassword)
    }

    user.name = data.name ?? user.name
    user.updatedAt = new Date()

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
