import { knex as setupKnex, Knex } from 'knex' // também importa o tipo Knex
import { env } from './env'

const databaseConnection =
  env.DATABASE_CLIENT === 'sqlite'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL

// exporta isoladamente as configurações do knex para conexão com o banco de dados
export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseConnection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

// inicializa uma instância do knex, com o objeto de configuração como argumento
// essa instância será usada sempre que precisar estabelecer uma conexão com o banco de dados
export const knex = setupKnex(config)
