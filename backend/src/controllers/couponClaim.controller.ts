import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";

const claimSchema = z.object({
  code: z.string().min(1),
  source: z.string().optional(),
});

interface CouponRow {
  id: string;
  code: string;
  isActive: number;
  expiresAt: Date | null;
}

export const claimCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, source } = claimSchema.parse(req.body);
  const userId = req.user!.userId;

  const coupon = await queryOne<CouponRow>("SELECT * FROM `Coupon` WHERE code = ? LIMIT 1", [code.toUpperCase()]);
  if (!coupon || !coupon.isActive) {
    throw ApiError.notFound("This coupon is not available");
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw ApiError.badRequest("This coupon has expired");
  }

  const existingClaim = await queryOne(
    "SELECT * FROM `UserCoupon` WHERE userId = ? AND couponId = ? LIMIT 1",
    [userId, coupon.id]
  );

  let claim = existingClaim;
  if (!existingClaim) {
    const id = createId();
    await execute(
      "INSERT INTO `UserCoupon` (id, userId, couponId, source, claimedAt) VALUES (?, ?, ?, ?, NOW(3))",
      [id, userId, coupon.id, source ?? "popup"]
    );
    claim = await queryOne("SELECT * FROM `UserCoupon` WHERE id = ? LIMIT 1", [id]);
  }

  res.status(201).json({ success: true, data: { coupon, claim }, message: "Coupon added to your account" });
});

export const listMyCoupons = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const rows = await query<Record<string, unknown>>(
    `SELECT uc.*, c.id as coupon_id, c.code as coupon_code, c.type as coupon_type, c.value as coupon_value,
            c.minOrderAmount as coupon_minOrderAmount, c.maxDiscount as coupon_maxDiscount,
            c.usageLimit as coupon_usageLimit, c.usedCount as coupon_usedCount,
            c.isFestival as coupon_isFestival, c.isActive as coupon_isActive,
            c.startsAt as coupon_startsAt, c.expiresAt as coupon_expiresAt, c.createdAt as coupon_createdAt
     FROM \`UserCoupon\` uc JOIN \`Coupon\` c ON c.id = uc.couponId
     WHERE uc.userId = ? ORDER BY uc.claimedAt DESC`,
    [userId]
  );

  const claims = rows.map((row) => {
    const coupon: Record<string, unknown> = {};
    const claim: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      if (key.startsWith("coupon_")) {
        coupon[key.replace("coupon_", "")] = value;
      } else {
        claim[key] = value;
      }
    }
    return { ...claim, coupon };
  });

  res.json({ success: true, data: claims });
});
