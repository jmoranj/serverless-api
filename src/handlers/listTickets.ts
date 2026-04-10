import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TicketRepository } from "../repositories/ticketRepository";
import { TicketService } from "../services/ticketService";
import { handleError } from "../utils/errors";

const service = new TicketService(new TicketRepository());

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tickets = await service.listAll();

    return {
      statusCode: 200,
      body: JSON.stringify({ data: tickets }),
    };
    
  } catch (error) {
    return handleError("listTickets", error);
  }
};
