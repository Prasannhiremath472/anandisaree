import { z } from "zod";

export const customerListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const customerStatusUpdateSchema = z.object({
  isActive: z.boolean(),
});
