import { Request, Response } from "express";
import sharp from "sharp";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 82;

/**
 * Accepts a single image upload, downsizes/re-encodes it with sharp to keep the
 * base64 payload reasonable, and returns a data URI ready to store directly in
 * ProductImage.url (LONGTEXT) — no external file storage required.
 */
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No image file provided");
  }

  const optimized = await sharp(req.file.buffer)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const base64 = optimized.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64}`;

  res.json({
    success: true,
    data: { dataUri, sizeBytes: optimized.length },
  });
});
