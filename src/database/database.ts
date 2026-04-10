import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const globalWithPrisma = global as typeof global & { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const { hostname, port, username, password, pathname } = new URL(
    process.env.DATABASE_URL!
  );

  const adapter = new PrismaMariaDb({
    host: hostname,
    port: Number(port) || 3306,
    user: username,
    password,
    database: pathname.slice(1),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalWithPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = prisma;
}
