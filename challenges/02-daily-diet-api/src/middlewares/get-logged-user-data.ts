import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database";

export async function getLoggedUserData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = request.cookies;

  const user = await knex("users").where({ sessionId }).select().first();

  if (!user) {
    return reply.status(401).send({
      error: "Não há usuário logado",
    });
  }

  request.user = user;
}
