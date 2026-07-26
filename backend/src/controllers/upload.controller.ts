import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/**
 * Accepts a single image upload and returns it as a data URI ready to store
 * directly in ProductImage.url (LONGTEXT) — no external file storage, and no
 * server-side resizing/re-encoding (sharp's native binary isn't reliable on
 * this host, so images are stored at their original size/format instead).
 */
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No image file provided");
  }

  const base64 = req.file.buffer.toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${base64}`;

  res.json({
    success: true,
    data: { dataUri, sizeBytes: req.file.buffer.length },
  });
});
