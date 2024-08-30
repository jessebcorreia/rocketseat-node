import { FastifyInstance } from "fastify";
import {
  createUser,
  loginUser,
  getUserMetrics,
  getLoggedUser,
  updateUser,
  deleteUser,
} from "./handler";
import { getLoggedUserData } from "../../middlewares/get-logged-user-data";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", createUser);
  app.post("/login", loginUser);

  app.get("/metrics", { preHandler: [getLoggedUserData] }, getUserMetrics);
  app.get("/", { preHandler: [getLoggedUserData] }, getLoggedUser);
  app.put("/", { preHandler: [getLoggedUserData] }, updateUser);
  app.delete("/", { preHandler: [getLoggedUserData] }, deleteUser);
}
