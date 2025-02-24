import database from "infra/database.js";
import { handleWebpackExternalForEdgeRuntime } from "next/dist/build/webpack/plugins/middleware-plugin";
import migrationRunner from "node-pg-migrate";
import { request } from "node:http";
import { join } from "node:path";

export default async function status(request, response) {
  const options = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations", //the same one used by cli version of node-pg-migrate
  };

  if (request.method === "GET") {
    handleGET(request, response, options);
  }

  if (request.method === "POST") {
    handlePOST(request, response, options);
  }

  return response.status(405);
}

async function handleGET(request, response, options) {
  const pendingMigrations = await migrationRunner(options);
  response.status(200).json(pendingMigrations);
}

async function handlePOST(request, response, options) {
  const migratedMigrations = await migrationRunner({
    ...options,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
