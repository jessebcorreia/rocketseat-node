import { prisma } from '@/lib/prisma'
import { Prisma, Users } from 'prisma/prisma-client' // importa o objeto que contém a tipagem (UsersCreateInput)
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<Users | null> {
    // o método findUnique() só busca chaves primárias ou registros únicos @unique
    const user = await prisma.users.findUnique({
      where: { id },
    })
    return user
  }

  async findByEmail(email: string) {
    // o método findUnique() só busca chaves primárias ou registros únicos @unique
    const user = await prisma.users.findUnique({
      where: { email },
    })
    return user
  }

  async create(data: Prisma.UsersCreateInput) {
    const user = await prisma.users.create({
      data,
    })
    return user
  }
}
