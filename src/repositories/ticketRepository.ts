import { Prisma } from "@prisma/client";
import { prisma } from "../database/database";
import { CreateTicketInput, Ticket } from "../models/ticketSchema";

type PrismaTicket = Prisma.TicketGetPayload<object>;

function toTicket(prismaTicket: PrismaTicket): Ticket {
  return { ...prismaTicket, createdAt: prismaTicket.createdAt.toISOString() };
}

export class TicketRepository {
  async create(data: CreateTicketInput): Promise<Ticket> {
    const ticket = await prisma.ticket.create({ data });

    return toTicket(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });

    return tickets.map(toTicket);
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    
    return ticket ? toTicket(ticket) : null;
  }
}
