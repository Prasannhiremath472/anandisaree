import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { query, queryOne, execute } from "../config/db";
import { ApiError } from "../utils/ApiError";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import { toCsv, sendCsv } from "../utils/csv";

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const status = req.query.status as string | undefined;
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  const conditions: string[] = ["1=1"];
  const params: string[] = [];
  if (status) {
    conditions.push("r.status = ?");
    params.push(status);
  }
  if (categoryId) {
    conditions.push("EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = r.productId AND pc.categoryId = ?)");
    params.push(categoryId);
  }
  const whereClause = conditions.join(" AND ");

  const rows = await query<Record<string, unknown>>(
    `SELECT r.*, u.name as user_name, u.email as user_email, p.name as product_name
     FROM \`Review\` r JOIN \`User\` u ON u.id = r.userId JOIN \`Product\` p ON p.id = r.productId
     WHERE ${whereClause} ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`Review\` r WHERE ${whereClause}`,
    params
  );

  const productIds = rows.map((r) => r.productId as string);
  const images = productIds.length
    ? await query<{ productId: string; url: string }>(
        `SELECT productId, url FROM \`ProductImage\` WHERE productId IN (${productIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC`,
        productIds
      )
    : [];

  const items = rows.map((row) => {
    const { user_name, user_email, product_name, ...review } = row;
    return {
      ...review,
      user: { name: user_name, email: user_email },
      product: {
        name: product_name,
        images: images.filter((img) => img.productId === review.productId).slice(0, 1),
      },
    };
  });

  res.json({ success: true, data: buildPaginatedResult(items, totalRow?.count ?? 0, pagination) });
});

export const exportReviews = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  const conditions: string[] = ["1=1"];
  const params: string[] = [];
  if (status) {
    conditions.push("r.status = ?");
    params.push(status);
  }
  if (categoryId) {
    conditions.push("EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = r.productId AND pc.categoryId = ?)");
    params.push(categoryId);
  }
  const whereClause = conditions.join(" AND ");

  const rows = await query<Record<string, unknown>>(
    `SELECT r.rating, r.title, r.comment, r.status, r.isFeatured, r.createdAt, u.name as customerName, p.name as productName
     FROM \`Review\` r JOIN \`User\` u ON u.id = r.userId JOIN \`Product\` p ON p.id = r.productId
     WHERE ${whereClause} ORDER BY r.createdAt DESC`,
    params
  );

  const headers = ["Product", "Customer", "Rating", "Title", "Comment", "Status", "Featured", "Created At"];
  const csvRows = rows.map((r) => [
    r.productName,
    r.customerName,
    r.rating,
    r.title,
    r.comment,
    r.status,
    r.isFeatured ? "Yes" : "No",
    new Date(r.createdAt as string).toISOString(),
  ]);

  sendCsv(res, "reviews.csv", toCsv(headers, csvRows));
});

const statusUpdateSchema = z.object({ status: z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]) });

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = statusUpdateSchema.parse(req.body);
  const existing = await queryOne<{ productId: string }>(
    "SELECT productId FROM `Review` WHERE id = ? LIMIT 1",
    [req.params.id]
  );
  if (!existing) throw ApiError.notFound("Review not found");

  await execute("UPDATE `Review` SET status = ?, updatedAt = NOW(3) WHERE id = ?", [status, req.params.id]);

  if (status === "APPROVED") {
    const agg = await queryOne<{ avgRating: number | null; count: number }>(
      "SELECT AVG(rating) as avgRating, COUNT(*) as count FROM `Review` WHERE productId = ? AND status = 'APPROVED'",
      [existing.productId]
    );
    await execute("UPDATE `Product` SET avgRating = ?, reviewCount = ? WHERE id = ?", [
      agg?.avgRating ?? 0,
      agg?.count ?? 0,
      existing.productId,
    ]);
  }

  const review = await queryOne("SELECT * FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: review });
});

const featuredUpdateSchema = z.object({ isFeatured: z.coerce.boolean() });

export const setReviewFeatured = asyncHandler(async (req: Request, res: Response) => {
  const { isFeatured } = featuredUpdateSchema.parse(req.body);
  const existing = await queryOne("SELECT id FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Review not found");

  await execute("UPDATE `Review` SET isFeatured = ?, updatedAt = NOW(3) WHERE id = ?", [isFeatured, req.params.id]);
  const review = await queryOne("SELECT * FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
  res.json({ success: true, data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const existing = await queryOne("SELECT id FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
  if (!existing) throw ApiError.notFound("Review not found");

  await execute("DELETE FROM `Review` WHERE id = ?", [req.params.id]);
  res.json({ success: true, data: null, message: "Review deleted" });
});
