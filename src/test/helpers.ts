import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { Request } from "../models/requestSchema";

/** Context mínimo para testes de handler (awsRequestId usado quando não há requestId do API Gateway). */
export function mockLambdaContext(
  awsRequestId = "test-aws-request-id"
): Context {
  return { awsRequestId } as Context;
}

export function makeEvent(
  overrides: Partial<APIGatewayProxyEvent> = {}
): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent["requestContext"],
    resource: "",
    ...overrides,
  };
}

export const mockRequest: Request = {
  id: "abc-123",
  title: "Fix login bug",
  description: "Users cannot login with SSO",
  priority: "HIGH",
  createdBy: "mario",
  status: "OPEN",
  createdAt: "2026-01-01T00:00:00.000Z",
};
