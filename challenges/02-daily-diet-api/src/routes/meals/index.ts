import { FastifyInstance } from "fastify";
import { getLoggedUserData } from "../../middlewares/get-logged-user-data";
import {
  createMeal,
  getMeal,
  getMeals,
  updateMeal,
  deleteMeal,
} from "./handler";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", getLoggedUserData); //middleware global

  app.post("/", createMeal);
  app.get("/", getMeals);
  app.get("/:id", getMeal);
  app.put("/:id", updateMeal);
  app.delete("/:id", deleteMeal);
}
