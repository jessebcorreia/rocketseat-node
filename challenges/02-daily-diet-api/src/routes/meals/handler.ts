import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../database";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function createMeal(request: FastifyRequest, reply: FastifyReply) {
  const createMealBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable().default(null),
    date: z.date().default(() => new Date()),
    isMealOnDietPlan: z.boolean().default(false),
  });

  const { name, description, date, isMealOnDietPlan } =
    createMealBodySchema.parse(request.body);

  const id = randomUUID();
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)

  const meal = {
    id,
    name,
    description,
    date,
    isMealOnDietPlan,
    user_id,
  };

  await knex("meals").insert(meal);

  return reply.status(201).send({
    message: "Refeição cadastrada!",
    meal,
  });
}

export async function getMeals(request: FastifyRequest, reply: FastifyReply) {
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)

  const userMeals = await knex("meals").where({ user_id }).select();

  if (!userMeals || userMeals.length === 0) {
    return reply.status(200).send({
      message: "Nenhuma refeição cadastrada",
    });
  }

  return reply.status(200).send({ userMeals });
}

export async function getMeal(request: FastifyRequest, reply: FastifyReply) {
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send({ message: "Informe o ID da refeição" });
  }

  const userMeal = await knex("meals").where({ id, user_id }).select().first();

  if (!userMeal) {
    return reply.status(404).send({
      message: "Refeição não encontrada",
    });
  }

  return reply.status(200).send({ userMeal });
}

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send({ message: "Informe o ID da refeição" });
  }

  const updateMealBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    isMealOnDietPlan: z.boolean().optional(),
  });

  const mealUpdate = updateMealBodySchema.parse(request.body);

  if (Object.keys(mealUpdate).length === 0) {
    return reply
      .status(400)
      .send({ message: "Não foi informado nenhum campo para atualização" });
  }

  const wasMealUpdated = await knex("meals")
    .where({ id, user_id })
    .update(mealUpdate);

  if (!id || !wasMealUpdated) {
    return reply.status(404).send({ message: "Refeição não encontrada" });
  }
  return reply.status(200).send({ message: "Refeição atualizada com sucesso" });
}

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send({ message: "Informe o ID da refeição" });
  }

  const wasMealDeleted = await knex("meals").where({ id, user_id }).delete();

  if (!wasMealDeleted) {
    return reply.status(404).send({ message: "Refeição não encontrada" });
  }
  return reply.status(200).send({ message: "Refeição deletada" });
}
