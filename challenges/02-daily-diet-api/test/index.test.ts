import { beforeEach, beforeAll, afterAll } from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

beforeEach(() => {
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

afterAll(async () => {
  await app.close();
});

import "./user.test";
import "./meals.test";
