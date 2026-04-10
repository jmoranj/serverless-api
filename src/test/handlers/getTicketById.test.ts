import { beforeEach, describe, expect, it, vi } from "vitest";
import { handler } from "../../handlers/getTicketById";
import { makeEvent, mockTicket } from "../helpers";

const mockFindById = vi.hoisted(() => vi.fn());

vi.mock("../../repositories/ticketRepository", () => ({
  TicketRepository: class {
    findById = mockFindById;
  },
}));

vi.mock("../../database/database", () => ({ prisma: {} }));

describe("GET /requests/{id}", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with the ticket when found", async () => {
    mockFindById.mockResolvedValue(mockTicket);

    const event = makeEvent({ pathParameters: { id: "abc-123" } });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.data).toMatchObject({ id: "abc-123", title: "Fix login bug" });
  });

  it("returns 404 when ticket does not exist", async () => {
    mockFindById.mockResolvedValue(null);

    const event = makeEvent({ pathParameters: { id: "nonexistent" } });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(404);
    expect(body.message).toContain("nonexistent");
  });

  it("returns 400 when id path param is missing", async () => {
    const event = makeEvent({ pathParameters: null });

    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.message).toBe("Missing path parameter: id");
  });
});
