import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { handleError } from "../utils/errors";

const service = new RequestService(new RequestRepository());

export const handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    const requests = await service.listAll();

    return {
      statusCode: 200,
      body: JSON.stringify({ data: requests }),
    };
    
  } catch (error) {
    return handleError("listRequests", error);
  }
};
