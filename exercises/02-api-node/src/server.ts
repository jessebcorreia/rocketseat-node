import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie) // plugin para cookies
app.register(transactionRoutes, {
  // com o prefix, todas as rotas aqui dentro iniciarão com /transactions
  prefix: 'transactions',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running!')
})
