import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { createRequestSchema } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { handleError } from "../utils/errors";
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
    const body = JSON.parse(event.body ?? "{}");

    const validatedBody = createRequestSchema.parse(body);

    const created = await service.create(validatedBody);

    logInfo("Request created successfully", requestId, {
      handler: "createRequest",
      id: created.id,
    });

    return withRequestIdHeader(
      {
        statusCode: 201,
        body: JSON.stringify({ message: "Request created", data: created }),
      },
      requestId
    );
  } catch (error) {
    return handleError("createRequest", error, requestId);
  }
};
