import { FastifyInstance } from 'fastify' // importação da tipagem para o .ts
import { z } from 'zod' // importação do objeto com todos os métodos do zod
import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionRoutes(app: FastifyInstance) {
  // como o método app.register do fastify no server.js já está definindo o prefix "/transactions", todas as rotas iniciarão assim por padrão

  app.addHook('preHandler', async (request) => {
    // exemplo de middleware global aplicável apenas às rotas em /transactions
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      // desestrutura o sessionId dos cookies
      const { sessionId } = request.cookies

      // faz a consulta ao banco
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      // faz outra consulta ao banco
      const allTransactions = await knex('transactions')
        .select('amount', 'created_at')
        .where('session_id', sessionId)

      // retorna ambas as consultas em um objeto
      return { summary, allTransactions }
    },
  )

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies
    const transactions = await knex('transactions')
      .select()
      .where('session_id', sessionId)
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    // validação do request.body com a biblioteca ZOD (basicamente, define que o body precisa ter como parâmetro um id -uuid- do tipo string)
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    // executa o método parse de um objeto zod (se falhar na validação, é lançada uma exceção automaticamente)
    const { id } = getTransactionParamsSchema.parse(request.params)

    // estabelece a conexão com o banco de dados, com um objeto dentro de .where(), que define as queries
    const transaction = await knex('transactions')
      .select()
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { transaction }
  })

  app.post('/', async (request, reply) => {
    // validação do request.body com a biblioteca ZOD
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // criação de uma variável que recebe o sessionId dentro de um cookie (se existir)
    let sessionId = request.cookies.sessionId

    // caso não exista, então cria atribui um id único ao sessionId e cria um cookie com essa string
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 60s * 60m * 24h * 7d = 7 days
      })
    }

    // realiza a conexão com o banco de dados e insere novos valores
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
