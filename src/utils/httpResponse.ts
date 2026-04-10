import type { APIGatewayProxyResult } from "aws-lambda";

const HEADER = "x-request-id";

export function withRequestIdHeader(
  result: APIGatewayProxyResult,
  requestId: string
): APIGatewayProxyResult {
  return {
    ...result,
    headers: {
      ...result.headers,
      [HEADER]: requestId,
    },
  };
}
