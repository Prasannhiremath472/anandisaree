import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute, type QueryParams } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { getDataUriDimensions } from "../utils/imageDimensions";
import { bannerCreateSchema, bannerUpdateSchema } from "../validation/banner.schema";

const BANNER_COLUMNS = ["title", "subtitle", "imageUrl", "mobileImageUrl", "linkUrl", "ctaLabel", "placement", "sortOrder", "isActive", "startsAt", "endsAt"] as const;

// Mirrors REQUIRED_DIMENSIONS in the admin BannerForm — enforced here too so
// a direct API call (or a stale/bypassed frontend) can't skip the check and
// save a banner that would render cropped/distorted on the storefront.
const REQUIRED_DIMENSIONS: Record<string, { width: number; height: number }> = {
  HOMEPAGE_SLIDER: { width: 1600, height: 466 },
  FESTIVAL_BANNER: { width: 1600, height: 500 },
  OFFER_BANNER: { width: 1200, height: 400 },
  COLLECTION_BANNER: { width: 1200, height: 900 },
  POPUP_BANNER: { width: 800, height: 800 },
};

function assertImageDimensions(placement: unknown, imageUrl: unknown) {
  if (typeof placement !== "string" || typeof imageUrl !== "string") return;
  const required = REQUIRED_DIMENSIONS[placement];
  if (!required) return;
  // Only base64 data URIs (freshly uploaded images) carry bytes we can
  // measure here; an unchanged imageUrl on update is a plain string that
  // was already validated when it was first uploaded.
  if (!imageUrl.startsWith("data:image/")) return;

  const dims = getDataUriDimensions(imageUrl);
  if (!dims) throw ApiError.badRequest("Could not read this image's dimensions.");
  if (dims.width !== required.width || dims.height !== required.height) {
    throw ApiError.badRequest(
      `This image is ${dims.width}×${dims.height}px. This banner placement requires exactly ${required.width}×${required.height}px.`
    );
  }
}

export const listBanners = asyncHandler(async (req: Request, res: Response) => {
  const placement = req.query.placement as string | undefined;
  const banners = placement
    ? await query("SELECT * FROM `Banner` WHERE placement = ? ORDER BY placement ASC, sortOrder ASC", [placement])
    : await query("SELECT * FROM `Banner` ORDER BY placement ASC, sortOrder ASC");
  res.json({ success: true, data: banners });
});

export const listPublicBanners = asyncHandler(async (req: Request, res: Response) => {
  const placement = req.query.placement as string | undefined;
  const params: QueryParams = [];
  let sql =
    "SELECT id, title, subtitle, imageUrl, mobileImageUrl, linkUrl, ctaLabel, placement, sortOrder FROM `Banner` WHERE isActive = 1 AND (startsAt IS NULL OR startsAt <= NOW()) AND (endsAt IS NULL OR endsAt >= NOW())";
  if (placement) {
    sql += " AND placement = ?";
    params.push(placement);
  }
  sql += " ORDER BY placement ASC, sortOrder ASC";
  const banners = await query(sql, params);
  res.json({ success: true, data: banners });
});

export const getBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await queryOne("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!banner) throw ApiError.notFound("Banner not found");
  res.json({ success: true, data: banner });
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const input = bannerCreateSchema.parse(req.body) as Record<string, unknown>;
  assertImageDimensions(input.placement, input.imageUrl);
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
  const existing = await queryOne<{ id: string; placement: string }>("SELECT id, placement FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Banner not found");
  assertImageDimensions(input.placement ?? existing.placement, input.imageUrl);

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
