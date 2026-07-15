import { z } from "zod";

export const cmsPageUpdateSchema = z.object({
  title: z.string().min(1),
  contentHtml: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const blogPostCreateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  contentHtml: z.string().min(1),
  coverImageUrl: z.string().optional(),
  categoryName: z.string().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
