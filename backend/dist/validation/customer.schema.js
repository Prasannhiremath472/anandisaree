"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerStatusUpdateSchema = exports.customerListQuerySchema = void 0;
const zod_1 = require("zod");
exports.customerListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    pageSize: zod_1.z.coerce.number().int().positive().max(100).optional(),
    search: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
exports.customerStatusUpdateSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
//# sourceMappingURL=customer.schema.js.map