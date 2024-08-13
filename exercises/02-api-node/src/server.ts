import { app } from './app'
import { env } from './env'

// método .listen é responsável por iniciar o servidor e ouvir as requisições http na porta indicada
app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? `0.0.0.0` : `localhost`,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
