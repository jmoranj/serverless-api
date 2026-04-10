import { APIGatewayProxyEvent } from "aws-lambda";
import { Ticket } from "../models/ticketSchema";

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

export const mockTicket: Ticket = {
  id: "abc-123",
  title: "Fix login bug",
  description: "Users cannot login with SSO",
  priority: "HIGH",
  createdBy: "mario",
  status: "OPEN",
  createdAt: "2026-01-01T00:00:00.000Z",
};
