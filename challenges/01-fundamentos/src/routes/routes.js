import { buildRoutePath } from "../utils/build-route-path.js";
import {
  listAllTasks,
  createNewTask,
  deleteTaskById,
  updateTaskById,
  toggleCompleteTaskById,
} from "./routes-handler.js";
import { uploadCsvHandler } from './csv-handler.js';

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: listAllTasks,
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: createNewTask,
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: deleteTaskById,
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: updateTaskById,
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: toggleCompleteTaskById,
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/upload"),
    handler: uploadCsvHandler,
  },
];
