import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import { blogPostCreateSchema, blogPostUpdateSchema, cmsPageUpdateSchema } from "../validation/cms.schema";

const CMS_PAGE_COLUMNS = ["title", "contentHtml", "metaTitle", "metaDescription"] as const;
const BLOG_POST_COLUMNS = [
  "title",
  "slug",
  "excerpt",
  "contentHtml",
  "coverImageUrl",
  "categoryName",
  "tags",
  "metaTitle",
  "metaDescription",
  "isPublished",
  "publishedAt",
] as const;

// CMS Pages (static site content: home, about, contact, privacy, terms, faq)
export const listCmsPages = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await query("SELECT * FROM `CmsPage` ORDER BY slug ASC");
  res.json({ success: true, data: pages });
});

export const getCmsPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await queryOne("SELECT * FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);
  if (!page) throw ApiError.notFound("CMS page not found");
  res.json({ success: true, data: page });
});

export const upsertCmsPage = asyncHandler(async (req: Request, res: Response) => {
  const input = cmsPageUpdateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne("SELECT id FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);

  const columns = CMS_PAGE_COLUMNS.filter((col) => input[col] !== undefined);
  const values = columns.map((col) => input[col] as string | null);

  if (existing) {
    if (columns.length) {
      await execute(
        `UPDATE \`CmsPage\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE slug = ?`,
        [...values, req.params.slug]
      );
    }
  } else {
    await execute(
      `INSERT INTO \`CmsPage\` (id, slug, ${columns.map((c) => `\`${c}\``).join(", ")}, updatedAt)
       VALUES (?, ?, ${columns.map(() => "?").join(", ")}, NOW(3))`,
      [createId(), req.params.slug, ...values]
    );
  }

  const page = await queryOne("SELECT * FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);
  res.json({ success: true, data: page });
});

// Blog Posts
export const listBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const search = req.query.search as string | undefined;

  const whereClause = search ? "title LIKE ?" : "1=1";
  const params = search ? [`%${search}%`] : [];

  const items = await query(
    `SELECT * FROM \`BlogPost\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`BlogPost\` WHERE ${whereClause}`,
    params
  );

  res.json({ success: true, data: buildPaginatedResult(items, totalRow?.count ?? 0, pagination) });
});

export const getBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await queryOne<Record<string, unknown>>("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [
    req.params.id,
  ]);
  if (!post) throw ApiError.notFound("Blog post not found");

  const comments = await query("SELECT * FROM `BlogComment` WHERE postId = ? ORDER BY createdAt DESC", [
    req.params.id,
  ]);

  res.json({ success: true, data: { ...post, comments } });
});

export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = blogPostCreateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne("SELECT id FROM `BlogPost` WHERE slug = ? LIMIT 1", [input.slug as string]);
  if (existing) throw ApiError.conflict("A blog post with this slug already exists");

  const id = createId();
  const data: Record<string, unknown> = { ...input, publishedAt: input.isPublished ? new Date() : null };
  const columns = BLOG_POST_COLUMNS.filter((col) => data[col] !== undefined);
  const values = columns.map((col) => data[col] as string | number | boolean | Date | null);

  await execute(
    `INSERT INTO \`BlogPost\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`,
    [id, ...values]
  );

  const post = await queryOne("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [id]);
  res.status(201).json({ success: true, data: post });
});

export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = blogPostUpdateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne<{ isPublished: number }>(
    "SELECT isPublished FROM `BlogPost` WHERE id = ? LIMIT 1",
    [req.params.id]
  );
  if (!existing) throw ApiError.notFound("Blog post not found");

  const data: Record<string, unknown> = {
    ...input,
    ...(input.isPublished && !existing.isPublished ? { publishedAt: new Date() } : {}),
  };
  const columns = BLOG_POST_COLUMNS.filter((col) => data[col] !== undefined);
  if (columns.length) {
    const values = columns.map((col) => data[col] as string | number | boolean | Date | null);
    await execute(
      `UPDATE \`BlogPost\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`,
      [...values, req.params.id]
    );
  }

  const post = await queryOne("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: post });
});

export const deleteBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const existing = await queryOne("SELECT id FROM `BlogPost` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Blog post not found");

  await execute("DELETE FROM `BlogPost` WHERE id = ?", [req.params.id]);
  res.json({ success: true, data: null, message: "Blog post deleted" });
});
