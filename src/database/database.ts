import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import { resolveMysqlConnectionParts } from "./resolveMysqlConnection";

const globalWithPrisma = global as typeof global & { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const { host, port, user, password, database } = resolveMysqlConnectionParts();

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalWithPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "prod") {
  globalWithPrisma.prisma = prisma;
}
