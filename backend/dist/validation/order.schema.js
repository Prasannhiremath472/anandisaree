"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusUpdateSchema = exports.orderListQuerySchema = void 0;
const zod_1 = require("zod");
exports.orderListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional(),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]).optional(),
    paymentStatus: zod_1.z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});
exports.orderStatusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"]),
    note: zod_1.z.string().optional(),
    trackingNumber: zod_1.z.string().optional(),
    courierName: zod_1.z.string().optional(),
});
//# sourceMappingURL=order.schema.js.map