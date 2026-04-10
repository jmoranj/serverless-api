import { ZodError } from "zod";
import { APIGatewayProxyResult } from "aws-lambda";
import { logError } from "./logger";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

function withRequestId(
  result: APIGatewayProxyResult,
  requestId: string
): APIGatewayProxyResult {
  return {
    ...result,
    headers: {
      ...result.headers,
      "x-request-id": requestId,
    },
  };
}

export function handleError(
  handlerName: string,
  error: unknown,
  requestId: string
): APIGatewayProxyResult {
  if (error instanceof ZodError) {
    return withRequestId(
      {
        statusCode: 422,
        body: JSON.stringify({
          message: "Validation failed",
          issues: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        }),
      },
      requestId
    );
  }

  if (error instanceof AppError) {
    return withRequestId(
      {
        statusCode: error.statusCode,
        body: JSON.stringify({ message: error.message }),
      },
      requestId
    );
  }

  if (error instanceof SyntaxError) {
    return withRequestId(
      {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON body" }),
      },
      requestId
    );
  }

  logError("Unhandled error in handler", requestId, {
    handler: handlerName,
    error: String(error),
  });

  return withRequestId(
    {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    },
    requestId
  );
}
