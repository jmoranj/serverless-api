import { prisma } from "../database/database";

export const handler = async () => {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS requests (
        id          VARCHAR(36)                                           NOT NULL,
        title       VARCHAR(255)                                          NOT NULL,
        description TEXT                                                  NOT NULL,
        priority    ENUM('LOW', 'MEDIUM', 'HIGH')                        NOT NULL,
        created_by  VARCHAR(255)                                          NOT NULL,
        status      ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED')    NOT NULL DEFAULT 'OPEN',
        created_at  DATETIME                                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    return { statusCode: 200, body: JSON.stringify({ message: "Migration applied successfully" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: "Migration failed", error: String(error) }) };
  }
};
