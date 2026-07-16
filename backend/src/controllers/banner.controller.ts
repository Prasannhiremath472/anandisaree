import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { bannerCreateSchema, bannerUpdateSchema } from "../validation/banner.schema";

const BANNER_COLUMNS = ["title", "imageUrl", "linkUrl", "placement", "sortOrder", "isActive", "startsAt", "endsAt"] as const;

export const listBanners = asyncHandler(async (req: Request, res: Response) => {
  const placement = req.query.placement as string | undefined;
  const banners = placement
    ? await query("SELECT * FROM `Banner` WHERE placement = ? ORDER BY placement ASC, sortOrder ASC", [placement])
    : await query("SELECT * FROM `Banner` ORDER BY placement ASC, sortOrder ASC");
  res.json({ success: true, data: banners });
});

export const getBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await queryOne("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!banner) throw ApiError.notFound("Banner not found");
  res.json({ success: true, data: banner });
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const input = bannerCreateSchema.parse(req.body) as Record<string, unknown>;
  const id = createId();
  const columns = BANNER_COLUMNS.filter((col) => input[col] !== undefined);
  const values = columns.map((col) => input[col] as string | number | boolean | null);

  await execute(
    `INSERT INTO \`Banner\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3))`,
    [id, ...values]
  );

  const banner = await queryOne("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [id]);
  res.status(201).json({ success: true, data: banner });
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const input = bannerUpdateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne("SELECT id FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Banner not found");

  const columns = BANNER_COLUMNS.filter((col) => input[col] !== undefined);
  if (columns.length) {
    const values = columns.map((col) => input[col] as string | number | boolean | null);
    await execute(`UPDATE \`Banner\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")} WHERE id = ?`, [
      ...values,
      req.params.id,
    ]);
  }

  const banner = await queryOne("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const existing = await queryOne("SELECT id FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Banner not found");

  await execute("DELETE FROM `Banner` WHERE id = ?", [req.params.id]);
  res.json({ success: true, data: null, message: "Banner deleted" });
});
