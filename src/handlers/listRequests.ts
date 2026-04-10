import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { listRequestsQuerySchema } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { handleError } from "../utils/errors";
import { withRequestIdHeader } from "../utils/httpResponse";
import { logInfo } from "../utils/logger";
import { resolveRequestId } from "../utils/requestId";

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
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const requestId = resolveRequestId(event, context);

  try {
    const raw = parseListQuery(event.queryStringParameters);

    const filters = listRequestsQuerySchema.parse(raw);

    const data = await service.list(filters);

    logInfo("Requests listed", requestId, {
      handler: "listRequests",
      count: data.length,
      filters,
    });

    return withRequestIdHeader(
      {
        statusCode: 200,
        body: JSON.stringify({ data }),
      },
      requestId
    );
  } catch (error) {
    return handleError("listRequests", error, requestId);
  }
};
