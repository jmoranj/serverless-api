import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TicketRepository } from "../repositories/ticketRepository";
import { TicketService } from "../services/ticketService";
import { BadRequestError, handleError } from "../utils/errors";

const service = new TicketService(new TicketRepository());

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};

    if (!id) throw new BadRequestError("Missing path parameter: id");

    const ticket = await service.getById(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: ticket }),
    };
    
  } catch (error) {
    return handleError("getTicketById", error);
  }
};
