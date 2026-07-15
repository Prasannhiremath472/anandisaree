"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyCoupons = exports.claimCoupon = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const claimSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    source: zod_1.z.string().optional(),
});
exports.claimCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { code, source } = claimSchema.parse(req.body);
    const userId = req.user.userId;
    const coupon = await prisma_1.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) {
        throw ApiError_1.ApiError.notFound("This coupon is not available");
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw ApiError_1.ApiError.badRequest("This coupon has expired");
    }
    const claim = await prisma_1.prisma.userCoupon.upsert({
        where: { userId_couponId: { userId, couponId: coupon.id } },
        update: {},
        create: { userId, couponId: coupon.id, source: source ?? "popup" },
    });
    res.status(201).json({ success: true, data: { coupon, claim }, message: "Coupon added to your account" });
});
exports.listMyCoupons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const claims = await prisma_1.prisma.userCoupon.findMany({
        where: { userId },
        include: { coupon: true },
        orderBy: { claimedAt: "desc" },
    });
    res.json({ success: true, data: claims });
});
//# sourceMappingURL=couponClaim.controller.js.map