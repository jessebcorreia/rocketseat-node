import { Knex } from "knex"; //manter

interface Meal {
  id: string;
  name: string;
  description?: string | null;
  date: Date;
  isMealOnDietPlan: boolean;
  user_id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  sessionId: string;
}

declare module "knex/types/tables" {
  export interface Tables {
    users: User;
    meals: Meal;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
