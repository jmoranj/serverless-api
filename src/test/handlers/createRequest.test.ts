import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../../handlers/createRequest";
import { makeEvent, mockRequest } from "../helpers";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("../../repositories/requestRepository", () => ({
  RequestRepository: class {
    create = mockCreate;
  },
}));

vi.mock("../../database/database", () => ({ prisma: {} }));

describe("POST /requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue(mockRequest);
  });

  it("returns 201 with the created request", async () => {
    const event = makeEvent({
      body: JSON.stringify({
        title: "Fix login bug",
        description: "Users cannot login with SSO",
        priority: "HIGH",
        createdBy: "mario",
      }),
    });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(body.data).toMatchObject({ id: "abc-123", title: "Fix login bug" });
  });

  it("returns 422 when title is too short", async () => {
    const event = makeEvent({
      body: JSON.stringify({
        title: "ab",
        description: "Users cannot login with SSO",
        priority: "HIGH",
        createdBy: "mario",
      }),
    });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(422);
    expect(body.message).toBe("Validation failed");
    expect(body.issues).toContainEqual(
      expect.objectContaining({ field: "title" })
    );
  });

  it("returns 422 when priority is invalid", async () => {
    const event = makeEvent({
      body: JSON.stringify({
        title: "Valid title",
        description: "Valid description here",
        priority: "URGENT",
        createdBy: "mario",
      }),
    });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(422);
    expect(body.issues).toContainEqual(
      expect.objectContaining({ field: "priority" })
    );
  });

  it("returns 422 when required fields are missing", async () => {
    const event = makeEvent({ body: JSON.stringify({ title: "Only title" }) });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(422);
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("returns 400 when body is invalid JSON", async () => {
    const event = makeEvent({ body: "not-json" });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.message).toBe("Invalid JSON body");
  });

  it("returns 422 when body is null", async () => {
    const event = makeEvent({ body: null });

    const result = await handler(event);

    expect(result.statusCode).toBe(422);
  });
});
