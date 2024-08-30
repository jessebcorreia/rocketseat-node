import { object, z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../database";
import { randomUUID } from "crypto";
import { compare, hash } from "bcryptjs";
import { checkIfNewPasswordMatches } from "../../utils/check-if-new-password-matches";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string().min(3, "O nome precisa ter, no mínimo, 3 caracteres"),
    email: z.string().email("O e-mail fornecido não é válido"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(20, "A senha deve ter no máximo 20 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[@$!%*?&]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
  });

  const { name, email, password } = createUserBodySchema.parse(request.body);

  const passwordHash = await hash(password, 6);

  const id = randomUUID();

  const [user] = await knex("users")
    .insert({
      id,
      name,
      email,
      password: passwordHash,
    })
    .returning("*");

  return reply.clearCookie("sessionId", { path: "/" }).status(201).send({
    message: "Usuário criado",
    user,
  });
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const loginUserBodySchema = z.object({
    email: z.string().email("Digite um e-mail válido"),
    password: z.string(),
  });

  const { email, password } = loginUserBodySchema.parse(request.body);

  const user = await knex("users")
    .select("password", "id", "name")
    .where({ email })
    .first();

  if (!user) {
    return reply.status(401).send({
      message: "Verifique se o e-mail e/ou senha foram digitados corretamente",
    });
  }

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    return reply.status(401).send({
      message: "Verifique se o e-mail e/ou senha foram digitados corretamente",
    });
  }

  const id = randomUUID();
  await knex("users").update({ sessionId: id }).where({ id: user.id });

  return reply
    .status(200)
    .cookie("sessionId", id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 60s * 60m * 24h * 7d = 7 days
    })
    .send({
      message: "Foi realizado o login do usuário!",
      user: { name: user.name, email, id: user.id, sessionId: id },
    });
}

export async function getUserMetrics(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: user_id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)

  const totalMeals = await knex("meals")
    .where({ user_id })
    .count("* as total")
    .first();

  const mealsOnDiet = await knex("meals")
    .where({ user_id, isMealOnDietPlan: true })
    .count("* as total")
    .first();

  const mealsOffDiet = await knex("meals")
    .where({ user_id, isMealOnDietPlan: false })
    .count("* as total")
    .first();

  const meals = await knex("meals")
    .where({ user_id })
    .orderBy("date", "asc")
    .select("isMealOnDietPlan");

  let currentSequence = 0;
  let maxSequenceOnDiet = 0;

  meals.forEach((meal) => {
    if (meal.isMealOnDietPlan) {
      currentSequence += 1;
      maxSequenceOnDiet = Math.max(currentSequence, maxSequenceOnDiet);
    } else {
      currentSequence = 0;
    }
  });

  const result = { totalMeals, mealsOnDiet, mealsOffDiet, maxSequenceOnDiet };

  return reply.status(200).send(result);
}

export async function getLoggedUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { user } = request;

  const userDataWithoutPassword = (() => {
    const entries = Object.entries(user!); // exclamação para evitar o erro do typescript (validação pelo middleware)
    const entriesFiltered = entries.filter(([key, _]) => {
      return key !== "password";
    });
    const entriesObject = Object.fromEntries(entriesFiltered);
    return entriesObject;
  })();

  return { userDataWithoutPassword };
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserBodySchema = z.object({
    name: z
      .string()
      .min(3, "O nome precisa ter, no mínimo, 3 caracteres")
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(20, "A senha deve ter no máximo 20 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(
        /[@$!%*?&]/,
        "A senha deve conter pelo menos um caractere especial"
      )
      .optional(),
    oldPassword: z.string().optional(),
  });

  const user = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)

  const body = updateUserBodySchema.parse(request.body);

  const { oldPassword, ...updateFields } = body;

  try {
    await checkIfNewPasswordMatches(user, updateFields.password, oldPassword);
  } catch (err: any) {
    return reply.status(400).send({ message: err.message });
  }

  if (updateFields.password) {
    updateFields.password = await hash(updateFields.password, 6);
  }

  const updateData = (() => {
    const entries = Object.entries(updateFields);
    const entriesFiltered = entries.filter(([_, value]) => {
      return value !== undefined;
    });
    const entriesObject = Object.fromEntries(entriesFiltered);
    return entriesObject;
  })();

  if (Object.keys(updateData).length === 0) {
    // Object.keys retorna um array com as chaves do objeto
    return reply
      .status(400)
      .send({ message: "Não foi informado nenhum campo para atualização" });
  }

  updateData.updated_at = new Date().toISOString();

  await knex("users").where({ id: user.id }).update(updateData);
  return reply.status(200).send({ message: "Usuário atualizado com sucesso" });
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.user!; // exclamação para evitar o erro do typescript (validação pelo middleware)

  await knex("users").where({ id }).delete();
  return reply.clearCookie("sessionId", { path: "/" }).status(200).send({
    message: "Usuário deletado com sucesso.",
  });
}
