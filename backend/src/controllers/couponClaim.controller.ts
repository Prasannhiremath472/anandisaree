import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

const claimSchema = z.object({
  code: z.string().min(1),
  source: z.string().optional(),
});

export const claimCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, source } = claimSchema.parse(req.body);
  const userId = req.user!.userId;

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) {
    throw ApiError.notFound("This coupon is not available");
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw ApiError.badRequest("This coupon has expired");
  }

  const claim = await prisma.userCoupon.upsert({
    where: { userId_couponId: { userId, couponId: coupon.id } },
    update: {},
    create: { userId, couponId: coupon.id, source: source ?? "popup" },
  });

  res.status(201).json({ success: true, data: { coupon, claim }, message: "Coupon added to your account" });
});

export const listMyCoupons = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const claims = await prisma.userCoupon.findMany({
    where: { userId },
    include: { coupon: true },
    orderBy: { claimedAt: "desc" },
  });

  res.json({ success: true, data: claims });
});
