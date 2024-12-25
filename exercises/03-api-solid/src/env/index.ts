import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

// validação das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
  JWT_SECRET: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env) // retorna um objeto com sucess=boolean e data{}

if (!_env.success) {
  console.error('Invalid environment variables!', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
