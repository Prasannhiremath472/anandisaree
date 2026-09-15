"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.setReviewFeatured = exports.updateReviewStatus = exports.exportReviews = exports.listReviews = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const csv_1 = require("../utils/csv");
exports.listReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const status = req.query.status;
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const conditions = ["1=1"];
    const params = [];
    if (status) {
        conditions.push("r.status = ?");
        params.push(status);
    }
    if (categoryId) {
        conditions.push("EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = r.productId AND pc.categoryId = ?)");
        params.push(categoryId);
    }
    const whereClause = conditions.join(" AND ");
    const rows = await (0, db_1.query)(`SELECT r.*, u.name as user_name, u.email as user_email, p.name as product_name
     FROM \`Review\` r JOIN \`User\` u ON u.id = r.userId JOIN \`Product\` p ON p.id = r.productId
     WHERE ${whereClause} ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Review\` r WHERE ${whereClause}`, params);
    const productIds = rows.map((r) => r.productId);
    const images = productIds.length
        ? await (0, db_1.query)(`SELECT productId, url FROM \`ProductImage\` WHERE productId IN (${productIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC`, productIds)
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
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, totalRow?.count ?? 0, pagination) });
});
exports.exportReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = req.query.status;
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const conditions = ["1=1"];
    const params = [];
    if (status) {
        conditions.push("r.status = ?");
        params.push(status);
    }
    if (categoryId) {
        conditions.push("EXISTS (SELECT 1 FROM `ProductCategory` pc WHERE pc.productId = r.productId AND pc.categoryId = ?)");
        params.push(categoryId);
    }
    const whereClause = conditions.join(" AND ");
    const rows = await (0, db_1.query)(`SELECT r.rating, r.title, r.comment, r.status, r.isFeatured, r.createdAt, u.name as customerName, p.name as productName
     FROM \`Review\` r JOIN \`User\` u ON u.id = r.userId JOIN \`Product\` p ON p.id = r.productId
     WHERE ${whereClause} ORDER BY r.createdAt DESC`, params);
    const headers = ["Product", "Customer", "Rating", "Title", "Comment", "Status", "Featured", "Created At"];
    const csvRows = rows.map((r) => [
        r.productName,
        r.customerName,
        r.rating,
        r.title,
        r.comment,
        r.status,
        r.isFeatured ? "Yes" : "No",
        new Date(r.createdAt).toISOString(),
    ]);
    (0, csv_1.sendCsv)(res, "reviews.csv", (0, csv_1.toCsv)(headers, csvRows));
});
const statusUpdateSchema = zod_1.z.object({ status: zod_1.z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]) });
exports.updateReviewStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = statusUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT productId FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    await (0, db_1.execute)("UPDATE `Review` SET status = ?, updatedAt = NOW(3) WHERE id = ?", [status, req.params.id]);
    if (status === "APPROVED") {
        const agg = await (0, db_1.queryOne)("SELECT AVG(rating) as avgRating, COUNT(*) as count FROM `Review` WHERE productId = ? AND status = 'APPROVED'", [existing.productId]);
        await (0, db_1.execute)("UPDATE `Product` SET avgRating = ?, reviewCount = ? WHERE id = ?", [
            agg?.avgRating ?? 0,
            agg?.count ?? 0,
            existing.productId,
        ]);
    }
    const review = await (0, db_1.queryOne)("SELECT * FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: review });
});
const featuredUpdateSchema = zod_1.z.object({ isFeatured: zod_1.z.coerce.boolean() });
exports.setReviewFeatured = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { isFeatured } = featuredUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    await (0, db_1.execute)("UPDATE `Review` SET isFeatured = ?, updatedAt = NOW(3) WHERE id = ?", [isFeatured, req.params.id]);
    const review = await (0, db_1.queryOne)("SELECT * FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: review });
});
exports.deleteReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Review` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Review not found");
    await (0, db_1.execute)("DELETE FROM `Review` WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: null, message: "Review deleted" });
});
//# sourceMappingURL=review.controller.js.map