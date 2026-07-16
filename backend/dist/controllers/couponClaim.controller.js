"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyCoupons = exports.claimCoupon = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const claimSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    source: zod_1.z.string().optional(),
});
exports.claimCoupon = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { code, source } = claimSchema.parse(req.body);
    const userId = req.user.userId;
    const coupon = await (0, db_1.queryOne)("SELECT * FROM `Coupon` WHERE code = ? LIMIT 1", [code.toUpperCase()]);
    if (!coupon || !coupon.isActive) {
        throw ApiError_1.ApiError.notFound("This coupon is not available");
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        throw ApiError_1.ApiError.badRequest("This coupon has expired");
    }
    const existingClaim = await (0, db_1.queryOne)("SELECT * FROM `UserCoupon` WHERE userId = ? AND couponId = ? LIMIT 1", [userId, coupon.id]);
    let claim = existingClaim;
    if (!existingClaim) {
        const id = (0, id_1.createId)();
        await (0, db_1.execute)("INSERT INTO `UserCoupon` (id, userId, couponId, source, claimedAt) VALUES (?, ?, ?, ?, NOW(3))", [id, userId, coupon.id, source ?? "popup"]);
        claim = await (0, db_1.queryOne)("SELECT * FROM `UserCoupon` WHERE id = ? LIMIT 1", [id]);
    }
    res.status(201).json({ success: true, data: { coupon, claim }, message: "Coupon added to your account" });
});
exports.listMyCoupons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const rows = await (0, db_1.query)(`SELECT uc.*, c.id as coupon_id, c.code as coupon_code, c.type as coupon_type, c.value as coupon_value,
            c.minOrderAmount as coupon_minOrderAmount, c.maxDiscount as coupon_maxDiscount,
            c.usageLimit as coupon_usageLimit, c.usedCount as coupon_usedCount,
            c.isFestival as coupon_isFestival, c.isActive as coupon_isActive,
            c.startsAt as coupon_startsAt, c.expiresAt as coupon_expiresAt, c.createdAt as coupon_createdAt
     FROM \`UserCoupon\` uc JOIN \`Coupon\` c ON c.id = uc.couponId
     WHERE uc.userId = ? ORDER BY uc.claimedAt DESC`, [userId]);
    const claims = rows.map((row) => {
        const coupon = {};
        const claim = {};
        for (const [key, value] of Object.entries(row)) {
            if (key.startsWith("coupon_")) {
                coupon[key.replace("coupon_", "")] = value;
            }
            else {
                claim[key] = value;
            }
        }
        return { ...claim, coupon };
    });
    res.json({ success: true, data: claims });
});
//# sourceMappingURL=couponClaim.controller.js.map