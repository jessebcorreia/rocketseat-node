import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify() // inicia uma instância do fastify

app.register(cookie) // plugin para cookies
app.register(transactionRoutes, {
  // objeto de configuração de plugin. Com o prefix, todas as rotas aqui dentro iniciarão com /transactions
  prefix: 'transactions',
})

// método .listen é responsável por iniciar o servidor e ouvir as requisições http na porta indicada
app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server Running!')
})
