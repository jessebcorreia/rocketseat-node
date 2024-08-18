import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

import { Users } from '@prisma/client' // importa apenas a tipagem

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: Users
}

export class RegisterUseCase {
  // ao utilizar alguma keyword de visibilidade (private, public, etc), o parâmetro vira automaticamente uma propriedade da classe
  constructor(private usersRepository: UsersRepository) {} // usersRepository é o nome do parâmetro que recebe a dependência externa

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    }) // assume que a dependência possui um método "create" e o executa, passando as informações do usuário
    return { user } // retorna um objeto que contém o usuário
  }
}
