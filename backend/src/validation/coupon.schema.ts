import { z } from "zod";

export const couponListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const couponCreateSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  type: z.enum(["PERCENTAGE", "FLAT", "BOGO"]),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().nonnegative().optional(),
  maxDiscount: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  isFestival: z.boolean().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
});

export const couponUpdateSchema = couponCreateSchema.partial();

export type CouponCreateInput = z.infer<typeof couponCreateSchema>;
export type CouponUpdateInput = z.infer<typeof couponUpdateSchema>;
