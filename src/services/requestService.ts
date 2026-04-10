import { CreateRequestInput, Request } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { NotFoundError } from "../utils/errors";

export class RequestService {
  constructor(private readonly repository: RequestRepository) {}

  async create(data: CreateRequestInput): Promise<Request> {
    return this.repository.create(data);
  }

  async listAll(): Promise<Request[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Request> {
    const request = await this.repository.findById(id);
    if (!request) throw new NotFoundError(`Request '${id}' not found`);
    return request;
  }
}
