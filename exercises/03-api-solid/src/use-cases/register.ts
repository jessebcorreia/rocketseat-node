import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const passwordHash = await hash(password, 6)

  // o método findUnique() só busca chaves primárias ou registros únicos @unique
  const userWithSameEmail = await prisma.users.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists.')
  }

  await prisma.users.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })
}
