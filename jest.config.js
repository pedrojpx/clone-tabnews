const nextJest = require("next/jest"); //next.js's transpiler to jest's version of js
const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
