import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionRoutes(app: FastifyInstance) {
  // como o método app.register do fastify no server.js já está definindo o prefix "/transactions", todas as rotas iniciarão assim por padrão

  app.addHook('preHandler', async (request) => {
    // exemplo de middleware global aplicável apenas às rotas /transactions
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies
    const transactions = await knex('transactions')
      .select()
      .where('session_id', sessionId)
    // desta forma é possível adicionar mais informações na resposta
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies
    // validação do request.body com a biblioteca ZOD
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamsSchema.parse(request.params)
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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 60s * 60m * 24h * 7d = 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
