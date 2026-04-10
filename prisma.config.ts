import "dotenv/config";
import { defineConfig } from "prisma/config";
import { databaseUrlFromEnv } from "./src/database/resolveMysqlConnection";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrlFromEnv(),
  },
});
