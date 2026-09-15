import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const listProductTags = asyncHandler(async (_req: Request, res: Response) => {
  const tags = await query("SELECT * FROM `ProductTag` ORDER BY name ASC");
  res.json({ success: true, data: tags });
});

const createTagSchema = z.object({ name: z.string().min(1).max(50) });

export const createProductTag = asyncHandler(async (req: Request, res: Response) => {
  const { name } = createTagSchema.parse(req.body);
  const slug = slugify(name);

  const existing = await queryOne<{ id: string }>("SELECT id FROM `ProductTag` WHERE name = ? OR slug = ? LIMIT 1", [
    name,
    slug,
  ]);
  if (existing) throw ApiError.conflict("This tag already exists");

  const id = createId();
  await execute("INSERT INTO `ProductTag` (id, name, slug, createdAt) VALUES (?, ?, ?, NOW(3))", [id, name, slug]);

  const tag = await queryOne("SELECT * FROM `ProductTag` WHERE id = ? LIMIT 1", [id]);
  res.status(201).json({ success: true, data: tag });
});
