export type MysqlConnectionParts = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

function trimOrEmpty(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function resolveMysqlConnectionParts(): MysqlConnectionParts {
  const host = trimOrEmpty(process.env.DB_HOST);
  const user = trimOrEmpty(process.env.DB_USER);
  const password = process.env.DB_PASSWORD ?? "";
  const database = trimOrEmpty(process.env.DB_NAME);
  const port = Number(process.env.DB_PORT || "3306") || 3306;

  if (!host || !user || !database) {
    throw new Error(
      "Database: set DB_HOST, DB_USER, DB_NAME (and DB_PASSWORD if needed; optional DB_PORT, default 3306)."
    );
  }

  return { host, port, user, password, database };
}

export function databaseUrlFromEnv(): string {
  const { host, port, user, password, database } = resolveMysqlConnectionParts();
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export function databaseUrlForPrismaConfig(): string {
  const host = trimOrEmpty(process.env.DB_HOST);
  const user = trimOrEmpty(process.env.DB_USER);
  const database = trimOrEmpty(process.env.DB_NAME);
  if (!host || !user || !database) {
    return "mysql://prisma:prisma@127.0.0.1:3306/prisma";
  }
  return databaseUrlFromEnv();
}
