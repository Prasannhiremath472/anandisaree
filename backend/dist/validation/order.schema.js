"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreateOrderSchema = exports.orderStatusUpdateSchema = exports.orderListQuerySchema = void 0;
const zod_1 = require("zod");
exports.orderListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional(),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]).optional(),
    paymentStatus: zod_1.z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
    categoryId: zod_1.z.string().optional(),
});
exports.orderStatusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]),
    note: zod_1.z.string().optional(),
    trackingNumber: zod_1.z.string().optional(),
    courierName: zod_1.z.string().optional(),
});
const adminOrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    variantId: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().int().positive(),
});
const adminOrderAddressSchema = zod_1.z.object({
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
});
exports.adminCreateOrderSchema = zod_1.z
    .object({
    // Either an existing customer (userId + addressId), or a walk-in
    // customer described inline (name/phone/email + a fresh address).
    userId: zod_1.z.string().optional(),
    addressId: zod_1.z.string().optional(),
    newCustomer: zod_1.z
        .object({
        name: zod_1.z.string().min(1),
        phone: zod_1.z.string().min(6),
        email: zod_1.z.string().email().optional(),
        address: adminOrderAddressSchema,
    })
        .optional(),
    paymentMethod: zod_1.z.enum(["COD", "RAZORPAY", "UPI", "CARD", "NETBANKING", "WALLET"]),
    paymentStatus: zod_1.z.enum(["PENDING", "PAID"]).optional(),
    items: zod_1.z.array(adminOrderItemSchema).min(1),
})
    .refine((data) => (data.userId && data.addressId) || data.newCustomer, {
    message: "Provide either an existing customer with an address, or new customer details",
});
//# sourceMappingURL=order.schema.js.map