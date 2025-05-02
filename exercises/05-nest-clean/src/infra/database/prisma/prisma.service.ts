import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
// Nas versões mais recentes: import { PrismaClient } from '../../../generated/prisma'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // super -> chama o construtor da classe pai (Prisma Client)
    super({
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect
  }

  onModuleDestroy() {
    return this.$disconnect
  }
}
