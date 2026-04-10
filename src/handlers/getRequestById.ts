import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { BadRequestError, handleError } from "../utils/errors";
import { withRequestIdHeader } from "../utils/httpResponse";
import { logInfo } from "../utils/logger";
import { resolveRequestId } from "../utils/requestId";

const service = new RequestService(new RequestRepository());

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const requestId = resolveRequestId(event, context);

  try {
    const { id } = event.pathParameters ?? {};

    if (!id) throw new BadRequestError("Missing path parameter: id");

    const data = await service.getById(id);

    logInfo("Request fetched by id", requestId, {
      handler: "getRequestById",
      id,
    });

    return withRequestIdHeader(
      {
        statusCode: 200,
        body: JSON.stringify({ data }),
      },
      requestId
    );
  } catch (error) {
    return handleError("getRequestById", error, requestId);
  }
};
