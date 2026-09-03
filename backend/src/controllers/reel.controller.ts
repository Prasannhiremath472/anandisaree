import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { reelCreateSchema, reelUpdateSchema } from "../validation/reel.schema";

const REEL_COLUMNS = ["caption", "videoUrl", "thumbnailUrl", "categoryId", "linkUrl", "sortOrder", "isActive"] as const;

export const listReels = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  const reels = categoryId
    ? await query(
        "SELECT * FROM `Reel` WHERE deletedAt IS NULL AND categoryId = ? ORDER BY sortOrder ASC",
        [categoryId]
      )
    : await query("SELECT * FROM `Reel` WHERE deletedAt IS NULL ORDER BY sortOrder ASC");
  res.json({ success: true, data: reels });
});

export const listPublicReels = asyncHandler(async (_req: Request, res: Response) => {
  const reels = await query(
    "SELECT id, caption, videoUrl, thumbnailUrl, linkUrl FROM `Reel` WHERE deletedAt IS NULL AND isActive = 1 ORDER BY sortOrder ASC"
  );
  res.json({ success: true, data: reels });
});

export const getReel = asyncHandler(async (req: Request, res: Response) => {
  const reel = await queryOne("SELECT * FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
  if (!reel) throw ApiError.notFound("Reel not found");
  res.json({ success: true, data: reel });
});

export const createReel = asyncHandler(async (req: Request, res: Response) => {
  const input = reelCreateSchema.parse(req.body) as Record<string, unknown>;
  const id = createId();
  const columns = REEL_COLUMNS.filter((col) => input[col] !== undefined);
  const values = columns.map((col) => input[col] as string | number | boolean | null);

  await execute(
    `INSERT INTO \`Reel\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`,
    [id, ...values]
  );

  const reel = await queryOne("SELECT * FROM `Reel` WHERE id = ? LIMIT 1", [id]);
  res.status(201).json({ success: true, data: reel });
});

export const updateReel = asyncHandler(async (req: Request, res: Response) => {
  const input = reelUpdateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne("SELECT id FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Reel not found");

  const columns = REEL_COLUMNS.filter((col) => input[col] !== undefined);
  if (columns.length) {
    const values = columns.map((col) => input[col] as string | number | boolean | null);
    await execute(`UPDATE \`Reel\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [
      ...values,
      req.params.id,
    ]);
  }

  const reel = await queryOne("SELECT * FROM `Reel` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: reel });
});

export const deleteReel = asyncHandler(async (req: Request, res: Response) => {
  const existing = await queryOne("SELECT id FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Reel not found");

  await execute("UPDATE `Reel` SET deletedAt = NOW(3) WHERE id = ?", [req.params.id]);
  res.json({ success: true, data: null, message: "Reel deleted" });
});
