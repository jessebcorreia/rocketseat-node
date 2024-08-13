import { FastifyReply, FastifyRequest } from 'fastify' // importação das tipagens para o typescript

// Midleware (preHandler) simples para verificar se existe uma sessionId ativa (cookie)
export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies

  // se não existe sessão ativa, retorna um objeto com a mensagem de erro
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
