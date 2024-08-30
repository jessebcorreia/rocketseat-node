import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

const databaseConnection =
  env.DATABASE_CLIENT === "sqlite"
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseConnection,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      if (env.DATABASE_CLIENT === "sqlite") {
        conn.run("PRAGMA foreign_keys = ON", done);
      } else {
        done(null, conn);
      }
    },
  },
};

export const knex = setupKnex(config);
