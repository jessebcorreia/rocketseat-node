import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.users.create({
  data: {
    name: 'Jessé Bruno Correia',
    email: 'jesse@email.com',
  },
})

export const app = fastify()
