import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config() // por padrão, procura as variáveis de ambiente no .env
}

// validação das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

// os métodos parse e safeParse são exclusivos do zod
// parse: lança uma exceção caso a validação não passe
// safeParse: não lança exceção, mas devolve um objeto com informações sobre o erro
const _env = envSchema.safeParse(process.env)

// se a validação não passar (ou seja, o objeto retornar sucess = false), será lançada uma exceção personalizada
if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables')
}

// se tudo estiver correto, exporta as variáveis de ambiente
export const env = _env.data
