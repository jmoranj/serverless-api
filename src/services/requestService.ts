import { CreateRequestInput, Request } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { NotFoundError } from "../utils/errors";

export class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  async create(data: CreateRequestInput): Promise<Request> {
    return this.repository.create(data);
  }

  async list(): Promise<Request[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Request> {
    const found = await this.repository.findById(id);

    if (!found) throw new NotFoundError(`Request '${id}' not found`);

    return found;
  }
}
