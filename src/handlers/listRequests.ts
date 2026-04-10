import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { listRequestsQuerySchema } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { handleError } from "../utils/errors";

const service = new RequestService(new RequestRepository());

function parseListQuery(
  query: APIGatewayProxyEvent["queryStringParameters"]
): Record<string, string | undefined> {
  if (!query) return {};

  return {
    createdBy: query.createdBy?.trim() || undefined,
    status: query.status?.trim() || undefined,
  };
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const raw = parseListQuery(event.queryStringParameters);

    const filters = listRequestsQuerySchema.parse(raw);

    const data = await service.list(filters);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return handleError("listRequests", error);
  }
};
