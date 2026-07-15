"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponUpdateSchema = exports.couponCreateSchema = exports.couponListQuerySchema = void 0;
const zod_1 = require("zod");
exports.couponListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional(),
    search: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
exports.couponCreateSchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(30).toUpperCase(),
    type: zod_1.z.enum(["PERCENTAGE", "FLAT", "BOGO"]),
    value: zod_1.z.coerce.number().positive(),
    minOrderAmount: zod_1.z.coerce.number().nonnegative().optional(),
    maxDiscount: zod_1.z.coerce.number().positive().optional(),
    usageLimit: zod_1.z.coerce.number().int().positive().optional(),
    isFestival: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    startsAt: zod_1.z.coerce.date().optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
});
exports.couponUpdateSchema = exports.couponCreateSchema.partial();
//# sourceMappingURL=coupon.schema.js.map