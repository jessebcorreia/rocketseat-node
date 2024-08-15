import { randomUUID } from "crypto";
import { Database } from "../middlewares/database.js";

const database = new Database();

export function listAllTasks(request, response) {
  const { search } = request.query;

  const tasks = database.select(
    "tasks",
    search ? { title: search, description: search } : null
  );
  return response.end(JSON.stringify(tasks));
}

export function createNewTask(request, response) {
  const { title, description } = request.body;

  if (!title || !description) {
    return response.writeHead(400).end();
  }

  const task = {
    id: randomUUID(),
    title,
    description,
    completed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  database.insert("tasks", task);
  return response.writeHead(201).end();
}

export function deleteTaskById(request, response) {
  const { id } = request.params;
  const tasks = database.select("tasks", { id });
  const invalidId = tasks.length !== 1;

  if (invalidId) {
    return response.writeHead(404).end();
  }

  database.delete("tasks", id);
  return response.writeHead(204).end();
}

export function updateTaskById(request, response) {
  const { id } = request.params;

  const tasks = database.select("tasks", { id });
  const invalidId = tasks.length !== 1;

  if (invalidId) {
    return response.writeHead(404).end();
  }

  const { title, description } = request.body;
  let newData = {};
  if (title) newData.title = title;
  if (description) newData.description = description;

  database.update("tasks", id, newData);
  return response.writeHead(204).end();
}

export function toggleCompleteTaskById(request, response) {
  const { id } = request.params;
  const tasks = database.select("tasks", { id });
  const invalidId = tasks.length !== 1;

  if (invalidId) {
    return response.writeHead(404).end();
  }

  const alreadyCompleted = tasks[0].completed_at !== null;
  const completed_at = alreadyCompleted ? null : new Date();
  const data = { completed_at };

  database.update("tasks", id, data);
  return response.writeHead(204).end();
}
