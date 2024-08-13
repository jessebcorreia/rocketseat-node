// arquivo app.ts separado do server.ts, para facilitar os testes automatizados

import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify() // inicia uma instância do fastify

app.register(cookie) // plugin para cookies
app.register(transactionRoutes, {
  // objeto de configuração de plugin. Com o prefix, todas as rotas aqui dentro iniciarão com /transactions
  prefix: 'transactions',
})
