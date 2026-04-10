import { prisma } from "../database/database";
import { CreateRequestInput, Request } from "../models/requestSchema";

export class RequestRepository {
  async create(data: CreateRequestInput): Promise<Request> {
    const row = await prisma.request.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        createdBy: data.createdBy,
      },
    });

    return this.toRequest(row);
  }

  async findAll(): Promise<Request[]> {
    const rows = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map(this.toRequest);
  }

  async findById(id: string): Promise<Request | null> {
    const row = await prisma.request.findUnique({ where: { id } });
    return row ? this.toRequest(row) : null;
  }

  private toRequest(row: {
    id: string;
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdBy: string;
    status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";
    createdAt: Date;
  }): Request {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      createdBy: row.createdBy,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
