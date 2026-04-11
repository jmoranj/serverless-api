import "dotenv/config";
import { defineConfig } from "prisma/config";
import { databaseUrlForPrismaConfig } from "./src/database/resolveMysqlConnection";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrlForPrismaConfig(),
  },
});
