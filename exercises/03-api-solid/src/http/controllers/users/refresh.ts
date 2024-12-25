import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })
  /**
   * Essa opção irá validar que o usuário está autenticado analisando apenas a existência do refresh cookie, sem verificar as informações do cabeçalho 'Authorization/Bearer/etc'
   * Caso não exista o refreshCookie, irá impedir a execução do restante do código.
   * Este controler serve apenas para renovar o cookie
   */

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

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
}
