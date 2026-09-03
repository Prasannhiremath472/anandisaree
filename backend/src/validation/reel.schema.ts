import { z } from "zod";

export const reelCreateSchema = z.object({
  caption: z.string().min(1),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  categoryId: z.string().optional(),
  linkUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const reelUpdateSchema = reelCreateSchema.partial();

export type ReelCreateInput = z.infer<typeof reelCreateSchema>;
export type ReelUpdateInput = z.infer<typeof reelUpdateSchema>;
