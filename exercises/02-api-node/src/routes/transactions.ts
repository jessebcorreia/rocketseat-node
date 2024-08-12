import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import { knex } from '../database'

export async function transactionRoutes(app: FastifyInstance) {
  // como o método app.register do fastify no server.js já está definindo o prefix "/transactions", todas as rotas iniciarão assim por padrão

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select()
    // desta forma é possível adicionar mais informações na resposta
    return { transactions }
  })

  app.get('/:id', async (request) => {
    // validação do request.body com a biblioteca ZOD
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamsSchema.parse(request.params)
    const transaction = await knex('transactions')
      .select()
      .where('id', id)
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

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
