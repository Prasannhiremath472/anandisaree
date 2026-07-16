import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import { query, queryOne, execute, QueryParams } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { couponCreateSchema, couponListQuerySchema, couponUpdateSchema } from "../validation/coupon.schema";

export const listCoupons = asyncHandler(async (req: Request, res: Response) => {
  const q = couponListQuerySchema.parse(req.query);
  const pagination = getPagination(req);

  const conditions: string[] = ["1=1"];
  const params: QueryParams = [];
  if (q.isActive !== undefined) {
    conditions.push("isActive = ?");
    params.push(q.isActive);
  }
  if (q.search) {
    conditions.push("code LIKE ?");
    params.push(`%${q.search}%`);
  }
  const whereClause = conditions.join(" AND ");

  const items = await query(
    `SELECT * FROM \`Coupon\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`Coupon\` WHERE ${whereClause}`,
    params
  );

  res.json({ success: true, data: buildPaginatedResult(items, totalRow?.count ?? 0, pagination) });
});

export const getCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await queryOne("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!coupon) throw ApiError.notFound("Coupon not found");
  res.json({ success: true, data: coupon });
});

const COUPON_COLUMNS = [
  "code",
  "type",
  "value",
  "minOrderAmount",
  "maxDiscount",
  "usageLimit",
  "isFestival",
  "isActive",
  "startsAt",
  "expiresAt",
] as const;

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const input = couponCreateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne("SELECT id FROM `Coupon` WHERE code = ? LIMIT 1", [input.code as string]);
  if (existing) throw ApiError.conflict("A coupon with this code already exists");

  const id = createId();
  const columns = COUPON_COLUMNS.filter((col) => input[col] !== undefined);
  const values = columns.map((col) => input[col] as string | number | boolean | null);

  await execute(
    `INSERT INTO \`Coupon\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3))`,
    [id, ...values]
  );

  const coupon = await queryOne("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [id]);
  res.status(201).json({ success: true, data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const input = couponUpdateSchema.parse(req.body) as Record<string, unknown>;
  const existing = await queryOne<{ code: string }>("SELECT code FROM `Coupon` WHERE id = ? LIMIT 1", [
    req.params.id,
  ]);
  if (!existing) throw ApiError.notFound("Coupon not found");

  if (input.code && input.code !== existing.code) {
    const conflict = await queryOne("SELECT id FROM `Coupon` WHERE code = ? LIMIT 1", [input.code as string]);
    if (conflict) throw ApiError.conflict("A coupon with this code already exists");
  }

  const columns = COUPON_COLUMNS.filter((col) => input[col] !== undefined);
  if (columns.length) {
    const values = columns.map((col) => input[col] as string | number | boolean | null);
    await execute(
      `UPDATE \`Coupon\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")} WHERE id = ?`,
      [...values, req.params.id]
    );
  }

  const coupon = await queryOne("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: coupon });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const existing = await queryOne("SELECT id FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Coupon not found");

  await execute("UPDATE `Coupon` SET isActive = 0 WHERE id = ?", [req.params.id]);
  res.json({ success: true, data: null, message: "Coupon deactivated" });
});
