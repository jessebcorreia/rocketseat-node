import { Prisma, Users } from '@prisma/client'

// cria a interface UsersRepository, indicando que possui um método "create", que recebe como parâmetro um objeto do tipo "Prisma.UsersCreateInput) e retorna uma promise
export interface UsersRepository {
  findById(id: string): Promise<Users | null>
  findByEmail(email: string): Promise<Users | null>
  create(data: Prisma.UsersCreateInput): Promise<Users>
}
