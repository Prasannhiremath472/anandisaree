import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import type { Prisma } from "@prisma/client";

export const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const status = req.query.status as string | undefined;

  const where: Prisma.ReviewWhereInput = status ? { status: status as never } : {};

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, images: { take: 1 } } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  res.json({ success: true, data: buildPaginatedResult(items, total, pagination) });
});

const statusUpdateSchema = z.object({ status: z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]) });

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = statusUpdateSchema.parse(req.body);
  const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Review not found");

  const review = await prisma.review.update({ where: { id: req.params.id }, data: { status } });

  if (status === "APPROVED") {
    const agg = await prisma.review.aggregate({
      where: { productId: review.productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
    });
  }

  res.json({ success: true, data: review });
});

const featuredUpdateSchema = z.object({ isFeatured: z.boolean() });

export const setReviewFeatured = asyncHandler(async (req: Request, res: Response) => {
  const { isFeatured } = featuredUpdateSchema.parse(req.body);
  const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Review not found");

  const review = await prisma.review.update({ where: { id: req.params.id }, data: { isFeatured } });
  res.json({ success: true, data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Review not found");

  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null, message: "Review deleted" });
});
