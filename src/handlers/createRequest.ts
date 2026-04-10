import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createRequestSchema } from "../models/requestSchema";
import { RequestRepository } from "../repositories/requestRepository";
import { RequestService } from "../services/requestService";
import { handleError } from "../utils/errors";

const service = new RequestService(new RequestRepository());

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body ?? "{}");

    const validatedBody = createRequestSchema.parse(body);

    const created = await service.create(validatedBody);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Request created", data: created }),
    };
  } catch (error) {
    return handleError("createRequest", error);
  }
};
