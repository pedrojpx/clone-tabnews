import database from "infra/database.js";
import { handleWebpackExternalForEdgeRuntime } from "next/dist/build/webpack/plugins/middleware-plugin";
import migrationRunner from "node-pg-migrate";
import { request } from "node:http";
import { join } from "node:path";

export default async function status(request, response) {
  if (request.method === "GET") {
    handleGET(request, response);
  }

  if (request.method === "POST") {
    handlePOST(request, response);
  }

  return response.status(405);
}

async function handleGET(request, response) {
  const migraitions = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations", //the same one used by cli version of node-pg-migrate
  });
  response.status(200).json(migraitions);
}

async function handlePOST(request, response) {
  const migraitions = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: false,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations", //the same one used by cli version of node-pg-migrate
  });
  response.status(200).json(migraitions);
}
