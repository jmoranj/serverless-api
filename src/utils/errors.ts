import { ZodError } from "zod";
import { APIGatewayProxyResult } from "aws-lambda";

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

export function handleError(context: string, error: unknown): APIGatewayProxyResult {
  if (error instanceof ZodError) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        message: "Validation failed",
        issues: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      }),
    };
  }

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ message: error.message }),
    };
  }

  if (error instanceof SyntaxError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON body" }),
    };
  }

  console.error(JSON.stringify({ handler: context, error: String(error) }));
  return {
    statusCode: 500,
    body: JSON.stringify({ message: "Internal server error" }),
  };
}
