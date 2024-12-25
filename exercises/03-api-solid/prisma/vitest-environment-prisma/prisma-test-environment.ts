import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  // URL Padrão: "postgres://docker:docker@localhost:5432/apisolid?schema=public"

  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  // é a única função que o environment precisa - ela será executada sempre antes de cada arquivo de testes
  async setup() {
    console.log('Setup')

    const schema = randomUUID() // crio um ID único e aleatório que servirá de nome para o schema do banco de dados
    const databaseUrl = generateDatabaseUrl(schema) // executo a função que irá gerar uma nova DATABASE_URL, recebendo o nome acima

    process.env.DATABASE_URL = databaseUrl // redefino a variável diretamente no process.env

    execSync('npx prisma migrate deploy')
    // execSync é a função responsável por executar comandos no terminal, porém escrito no arquivo de código
    // neste caso, estou executando o migrate deploy do prisma, para que ele não crie novas migrations, mas apenas execute as migrations que já existem

    // o retorno é o "teardown", que será executado ao final de cada arquivo de testes
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`, // deleta o banco de dados após os testes
        )
        await prisma.$disconnect
      },
    }
  },
}
