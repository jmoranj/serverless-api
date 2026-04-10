import { CreateTicketInput, Ticket } from "../models/ticketSchema";
import { TicketRepository } from "../repositories/ticketRepository";
import { NotFoundError } from "../utils/errors";

export class TicketService {
  constructor(private readonly repository: TicketRepository) {}

  async create(data: CreateTicketInput): Promise<Ticket> {
    return this.repository.create(data);
  }

  async listAll(): Promise<Ticket[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Ticket> {
    const ticket = await this.repository.findById(id);

    if (!ticket) throw new NotFoundError(`Ticket '${id}' not found`);
    
    return ticket;
  }
}
