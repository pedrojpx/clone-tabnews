import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const maxConnections = await database.query("show max_connections;");
  const openedConnections = await database.query(
    "SELECT * FROM pg_stat_activity where datname = 'local_db';",
  );

  console.log(openedConnections);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        open_connections: openedConnections.rows.length,
      },
    },
  });
}

export default status;
