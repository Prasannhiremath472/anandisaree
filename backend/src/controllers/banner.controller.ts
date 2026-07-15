import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { bannerCreateSchema, bannerUpdateSchema } from "../validation/banner.schema";

export const listBanners = asyncHandler(async (req: Request, res: Response) => {
  const placement = req.query.placement as string | undefined;
  const banners = await prisma.banner.findMany({
    where: placement ? { placement: placement as never } : undefined,
    orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
  });
  res.json({ success: true, data: banners });
});

export const getBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!banner) throw ApiError.notFound("Banner not found");
  res.json({ success: true, data: banner });
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const input = bannerCreateSchema.parse(req.body);
  const banner = await prisma.banner.create({ data: input });
  res.status(201).json({ success: true, data: banner });
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const input = bannerUpdateSchema.parse(req.body);
  const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Banner not found");

  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: input });
  res.json({ success: true, data: banner });
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Banner not found");

  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null, message: "Banner deleted" });
});
