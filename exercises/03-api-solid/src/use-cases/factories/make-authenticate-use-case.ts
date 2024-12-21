import { AuthenticateUseCase } from '../authenticate'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(usersRepository)

  return useCase
}
