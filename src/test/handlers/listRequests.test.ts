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
    expect(mockFindMany).toHaveBeenCalledWith();
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
