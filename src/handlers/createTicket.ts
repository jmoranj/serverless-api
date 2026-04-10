import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createTicketSchema } from "../models/ticketSchema";
import { TicketRepository } from "../repositories/ticketRepository";
import { TicketService } from "../services/ticketService";
import { handleError } from "../utils/errors";

const service = new TicketService(new TicketRepository());

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    
    const validatedBody = createTicketSchema.parse(body);

    const created = await service.create(validatedBody);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Ticket created", data: created }),
    };

  } catch (error) {
    return handleError("createTicket", error);
  }
};
