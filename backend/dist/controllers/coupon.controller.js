"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.listCoupons = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const pagination_1 = require("../utils/pagination");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const coupon_schema_1 = require("../validation/coupon.schema");
exports.listCoupons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = coupon_schema_1.couponListQuerySchema.parse(req.query);
    const pagination = (0, pagination_1.getPagination)(req);
    const where = {
        ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
        ...(query.search ? { code: { contains: query.search } } : {}),
    };
    const [items, total] = await Promise.all([
        prisma_1.prisma.coupon.findMany({ where, orderBy: { createdAt: "desc" }, skip: pagination.skip, take: pagination.take }),
        prisma_1.prisma.coupon.count({ where }),
    ]);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, total, pagination) });
});
exports.getCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const coupon = await prisma_1.prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (!coupon)
        throw ApiError_1.ApiError.notFound("Coupon not found");
    res.json({ success: true, data: coupon });
});
exports.createCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = coupon_schema_1.couponCreateSchema.parse(req.body);
    const existing = await prisma_1.prisma.coupon.findUnique({ where: { code: input.code } });
    if (existing)
        throw ApiError_1.ApiError.conflict("A coupon with this code already exists");
    const coupon = await prisma_1.prisma.coupon.create({ data: input });
    res.status(201).json({ success: true, data: coupon });
});
exports.updateCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = coupon_schema_1.couponUpdateSchema.parse(req.body);
    const existing = await prisma_1.prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Coupon not found");
    if (input.code && input.code !== existing.code) {
        const conflict = await prisma_1.prisma.coupon.findUnique({ where: { code: input.code } });
        if (conflict)
            throw ApiError_1.ApiError.conflict("A coupon with this code already exists");
    }
    const coupon = await prisma_1.prisma.coupon.update({ where: { id: req.params.id }, data: input });
    res.json({ success: true, data: coupon });
});
exports.deleteCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await prisma_1.prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Coupon not found");
    await prisma_1.prisma.coupon.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, data: null, message: "Coupon deactivated" });
});
//# sourceMappingURL=coupon.controller.js.map