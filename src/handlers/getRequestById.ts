import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { BadRequestError, handleError } from "../utils/errors";

const service = new RequestService(new RequestRepository());

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};
    
    if (!id) throw new BadRequestError("Missing path parameter: id");

    const request = await service.getById(id);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: request }),
    };
  } catch (error) {
    return handleError("getRequestById", error);
  }
};
