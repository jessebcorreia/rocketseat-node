import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        // está sendo utilizado o id do usuário para gerar o token
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      // serve para renovar o token de acesso do usuário, quando expirado
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // perde o acesso se ficar 7 dias sem entrar na aplicação
        },
      },
    )

    /**
     * o primeiro parâmetro da definição do cookie é o nome
     * o segundo parâmetro é o valor
     * o terceiro parâmetro é um objeto de configurações, que pode conter:
     * path: define quais rotas da aplicação terão acesso ao cookie
     * secure: define se o cookie utilizará encriptação HTTPS (muito importante definir como true)
     * sameSite: define se o cookie será acessível apenas dentro do mesmo domínio/site
     * httpOnly: define se o cookie será acessível apenas pelo back-end (true), no contexto de requisição/resposta
     */
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
