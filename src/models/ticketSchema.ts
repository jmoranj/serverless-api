import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  createdBy: z.string().min(2),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export type Ticket = CreateTicketInput & {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  createdAt: string;
};
