import type { APIGatewayProxyEvent, Context } from "aws-lambda";

/**
 * ID exposto pelo API Gateway (HTTP API / REST) — o mesmo que aparece nos access logs.
 * Fallback: ID da invocação Lambda (sempre presente), para correlacionar com CloudWatch.
 */
export function resolveRequestId(
  event: APIGatewayProxyEvent,
  context: Context
): string {
  const fromApi = (event.requestContext as { requestId?: string } | undefined)
    ?.requestId;

  return fromApi ?? context.awsRequestId;
}
