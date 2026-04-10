import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  createdBy: z.string().min(2),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export type Request = CreateRequestInput & {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  createdAt: string;
};