import { FastifyInstance } from 'fastify'
import { container } from 'tsyringe'
import { RegisterUserController } from '../controllers/users/register-user-controller'
import { AuthenticateUserController } from '../controllers/users/authenticate-user-controller'
import { GetUserProfileController } from '../controllers/users/get-user-profile-controller'
import { UpdateUserProfileController } from '../controllers/users/update-user-profile-controller'
import { DeleteUserProfileController } from '../controllers/users/delete-user-profile-controller'
import { verifyJwt } from '../hooks/verify-jwt'
import { ForgotPasswordController } from '../controllers/users/forgot-password-controller'
import { ResetPasswordController } from '../controllers/users/reset-password-controller'

export async function userRoutes(app: FastifyInstance) {
  const registerUserController = container.resolve(RegisterUserController)
  const authenticateUserController = container.resolve(
    AuthenticateUserController,
  )
  const getUserProfileController = container.resolve(GetUserProfileController)
  const updateUserProfileController = container.resolve(
    UpdateUserProfileController,
  )
  const deleteUserProfileController = container.resolve(
    DeleteUserProfileController,
  )
  const forgotPasswordController = container.resolve(ForgotPasswordController)
  const resetPasswordController = container.resolve(ResetPasswordController)

  app.post('/users', (request, reply) =>
    registerUserController.handle(request, reply),
  )
  app.post('/sessions', (request, reply) =>
    authenticateUserController.handle(request, reply),
  )

  app.post('/password/forgot', (request, reply) =>
    forgotPasswordController.handle(request, reply),
  )
  app.post('/password/reset', (request, reply) =>
    resetPasswordController.handle(request, reply),
  )

  app.get('/me', { onRequest: [verifyJwt] }, (request, reply) =>
    getUserProfileController.handle(request, reply),
  )
  app.patch('/me', { onRequest: [verifyJwt] }, (request, reply) =>
    updateUserProfileController.handle(request, reply),
  )
  app.delete('/me', { onRequest: [verifyJwt] }, (request, reply) =>
    deleteUserProfileController.handle(request, reply),
  )
}
