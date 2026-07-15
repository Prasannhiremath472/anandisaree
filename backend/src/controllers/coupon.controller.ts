import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { couponCreateSchema, couponListQuerySchema, couponUpdateSchema } from "../validation/coupon.schema";
import type { Prisma } from "@prisma/client";

export const listCoupons = asyncHandler(async (req: Request, res: Response) => {
  const query = couponListQuerySchema.parse(req.query);
  const pagination = getPagination(req);

  const where: Prisma.CouponWhereInput = {
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search ? { code: { contains: query.search } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, skip: pagination.skip, take: pagination.take }),
    prisma.coupon.count({ where }),
  ]);

  res.json({ success: true, data: buildPaginatedResult(items, total, pagination) });
});

export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) throw ApiError.notFound("Coupon not found");
  res.json({ success: true, data: coupon });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const input = couponCreateSchema.parse(req.body);
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw ApiError.conflict("A coupon with this code already exists");

  const coupon = await prisma.coupon.create({ data: input });
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const input = couponUpdateSchema.parse(req.body);
  const existing = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Coupon not found");

  if (input.code && input.code !== existing.code) {
    const conflict = await prisma.coupon.findUnique({ where: { code: input.code } });
    if (conflict) throw ApiError.conflict("A coupon with this code already exists");
  }

  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: input });
  res.json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Coupon not found");

  await prisma.coupon.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, data: null, message: "Coupon deactivated" });
});
