"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.setReviewFeatured = exports.updateReviewStatus = exports.listReviews = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
exports.listReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const status = req.query.status;
    const where = status ? { status: status } : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.review.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: { take: 1 } } },
            },
        }),
        prisma_1.prisma.review.count({ where }),
    ]);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, total, pagination) });
});
const statusUpdateSchema = zod_1.z.object({ status: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]) });
exports.updateReviewStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = statusUpdateSchema.parse(req.body);
    const existing = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    const review = await prisma_1.prisma.review.update({ where: { id: req.params.id }, data: { status } });
    if (status === "APPROVED") {
        const agg = await prisma_1.prisma.review.aggregate({
            where: { productId: review.productId, status: "APPROVED" },
            _avg: { rating: true },
            _count: true,
        });
        await prisma_1.prisma.product.update({
            where: { id: review.productId },
            data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
        });
    }
    res.json({ success: true, data: review });
});
const featuredUpdateSchema = zod_1.z.object({ isFeatured: zod_1.z.boolean() });
exports.setReviewFeatured = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { isFeatured } = featuredUpdateSchema.parse(req.body);
    const existing = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    const review = await prisma_1.prisma.review.update({ where: { id: req.params.id }, data: { isFeatured } });
    res.json({ success: true, data: review });
});
exports.deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    await prisma_1.prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null, message: "Review deleted" });
});
//# sourceMappingURL=review.controller.js.map