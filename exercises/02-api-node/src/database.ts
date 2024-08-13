import { knex as setupKnex, Knex } from 'knex' // também importa o tipo Knex
import { env } from './env'

// exporta isoladamente as configurações do knex para conexão com o banco de dados
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

// inicializa uma instância do knex, com o objeto de configuração como argumento
// essa instância será usada sempre que precisar estabelecer uma conexão com o banco de dados
export const knex = setupKnex(config)
