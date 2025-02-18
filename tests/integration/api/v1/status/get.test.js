test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const body = await response.json();
  expect(body.updated_at).toBeDefined();
  expect(body.updated_at).toBe(new Date(body.updated_at).toISOString());
  expect(body.dependencies.database.version).toEqual("16.0");
  expect(body.dependencies.database.max_connections).toEqual(100);
  expect(body.dependencies.database.open_connections).toEqual(1);
});
