import { Prisma } from "@prisma/client";
import { prisma } from "../database/database";
import { CreateRequestInput, Request } from "../models/requestSchema";

type PrismaRequestRow = Prisma.RequestGetPayload<object>;

function toRequest(row: PrismaRequestRow): Request {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export class RequestRepository {
  async create(data: CreateRequestInput): Promise<Request> {
    const created = await prisma.request.create({ data });

    return toRequest(created);
  }

  async findMany(): Promise<Request[]> {
    const rows = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map(toRequest);
  }

  async findById(id: string): Promise<Request | null> {
    const row = await prisma.request.findUnique({ where: { id } });

    return row ? toRequest(row) : null;
  }
}
