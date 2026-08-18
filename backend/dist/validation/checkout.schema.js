"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createOrderSchema = exports.addressSchema = void 0;
const zod_1 = require("zod");
exports.addressSchema = zod_1.z.object({
    type: zod_1.z.enum(["HOME", "WORK", "OTHER"]).optional(),
    fullName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(6),
    line1: zod_1.z.string().min(1),
    line2: zod_1.z.string().optional(),
    landmark: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1),
    district: zod_1.z.string().optional(),
    state: zod_1.z.string().min(1),
    pincode: zod_1.z.string().min(4),
    isDefault: zod_1.z.coerce.boolean().optional(),
});
exports.createOrderSchema = zod_1.z.object({
    addressId: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.enum(["COD", "RAZORPAY"]),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        variantId: zod_1.z.string().optional(),
        quantity: zod_1.z.coerce.number().int().positive(),
    }))
        .min(1),
});
exports.verifyPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1),
    razorpayOrderId: zod_1.z.string().min(1),
    razorpayPaymentId: zod_1.z.string().min(1),
    razorpaySignature: zod_1.z.string().min(1),
});
//# sourceMappingURL=checkout.schema.js.map