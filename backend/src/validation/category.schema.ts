import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  group: z.enum(["MAHARASHTRIAN", "PAN_INDIAN"]).optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
