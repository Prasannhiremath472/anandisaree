"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.listCoupons = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const pagination_1 = require("../utils/pagination");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const coupon_schema_1 = require("../validation/coupon.schema");
exports.listCoupons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const q = coupon_schema_1.couponListQuerySchema.parse(req.query);
    const pagination = (0, pagination_1.getPagination)(req);
    const conditions = ["1=1"];
    const params = [];
    if (q.isActive !== undefined) {
        conditions.push("isActive = ?");
        params.push(q.isActive);
    }
    if (q.search) {
        conditions.push("code LIKE ?");
        params.push(`%${q.search}%`);
    }
    const whereClause = conditions.join(" AND ");
    const items = await (0, db_1.query)(`SELECT * FROM \`Coupon\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Coupon\` WHERE ${whereClause}`, params);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, totalRow?.count ?? 0, pagination) });
});
exports.getCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const coupon = await (0, db_1.queryOne)("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!coupon)
        throw ApiError_1.ApiError.notFound("Coupon not found");
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
];
exports.createCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = coupon_schema_1.couponCreateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Coupon` WHERE code = ? LIMIT 1", [input.code]);
    if (existing)
        throw ApiError_1.ApiError.conflict("A coupon with this code already exists");
    const id = (0, id_1.createId)();
    const columns = COUPON_COLUMNS.filter((col) => input[col] !== undefined);
    const values = columns.map((col) => input[col]);
    await (0, db_1.execute)(`INSERT INTO \`Coupon\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3))`, [id, ...values]);
    const coupon = await (0, db_1.queryOne)("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [id]);
    res.status(201).json({ success: true, data: coupon });
});
exports.updateCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = coupon_schema_1.couponUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT code FROM `Coupon` WHERE id = ? LIMIT 1", [
        req.params.id,
    ]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Coupon not found");
    if (input.code && input.code !== existing.code) {
        const conflict = await (0, db_1.queryOne)("SELECT id FROM `Coupon` WHERE code = ? LIMIT 1", [input.code]);
        if (conflict)
            throw ApiError_1.ApiError.conflict("A coupon with this code already exists");
    }
    const columns = COUPON_COLUMNS.filter((col) => input[col] !== undefined);
    if (columns.length) {
        const values = columns.map((col) => input[col]);
        await (0, db_1.execute)(`UPDATE \`Coupon\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")} WHERE id = ?`, [...values, req.params.id]);
    }
    const coupon = await (0, db_1.queryOne)("SELECT * FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: coupon });
});
exports.deleteCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Coupon` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Coupon not found");
    await (0, db_1.execute)("UPDATE `Coupon` SET isActive = 0 WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: null, message: "Coupon deactivated" });
});
//# sourceMappingURL=coupon.controller.js.map