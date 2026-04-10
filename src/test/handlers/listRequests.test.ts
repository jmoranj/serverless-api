import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../../handlers/listRequests";
import { makeEvent, mockRequest } from "../helpers";

const mockFindMany = vi.hoisted(() => vi.fn());

vi.mock("../../repositories/requestRepository", () => ({
  RequestRepository: class {
    findMany = mockFindMany;
  },
}));

vi.mock("../../database/database", () => ({ prisma: {} }));

describe("GET /requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with a list of requests", async () => {
    mockFindMany.mockResolvedValue([mockRequest, { ...mockRequest, id: "xyz-456" }]);

    const result = await handler(makeEvent());
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.data[0]).toMatchObject({ id: "abc-123" });
    expect(mockFindMany).toHaveBeenCalledWith({});
  });

  it("passes createdBy filter to the repository", async () => {
    mockFindMany.mockResolvedValue([mockRequest]);

    const result = await handler(
      makeEvent({
        queryStringParameters: { createdBy: "mario" },
      })
    );
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({ createdBy: "mario" });
    expect(body.data).toHaveLength(1);
  });

  it("passes status filter to the repository", async () => {
    mockFindMany.mockResolvedValue([]);

    await handler(
      makeEvent({
        queryStringParameters: { status: "OPEN" },
      })
    );

    expect(mockFindMany).toHaveBeenCalledWith({ status: "OPEN" });
  });

  it("passes both filters when both query params are present", async () => {
    mockFindMany.mockResolvedValue([]);

    await handler(
      makeEvent({
        queryStringParameters: { createdBy: "mario", status: "DONE" },
      })
    );

    expect(mockFindMany).toHaveBeenCalledWith({
      createdBy: "mario",
      status: "DONE",
    });
  });

  it("returns 422 when status is invalid", async () => {
    const result = await handler(
      makeEvent({
        queryStringParameters: { status: "INVALID" },
      })
    );
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(422);
    expect(body.message).toBe("Validation failed");
    expect(body.issues).toContainEqual(
      expect.objectContaining({ field: "status" })
    );
  });

  it("returns 422 when createdBy is too short", async () => {
    const result = await handler(
      makeEvent({
        queryStringParameters: { createdBy: "a" },
      })
    );
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(422);
    expect(body.issues).toContainEqual(
      expect.objectContaining({ field: "createdBy" })
    );
  });

  it("returns 200 with an empty list when there are no requests", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await handler(makeEvent());
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.data).toEqual([]);
  });

  it("returns 500 when repository throws an unexpected error", async () => {
    mockFindMany.mockRejectedValue(new Error("DB connection lost"));

    const result = await handler(makeEvent());
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(500);
    expect(body.message).toBe("Internal server error");
  });
});
