"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryUpdateSchema = exports.categoryCreateSchema = void 0;
const zod_1 = require("zod");
exports.categoryCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    group: zod_1.z.enum(["MAHARASHTRIAN", "PAN_INDIAN"]).optional(),
    imageUrl: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sortOrder: zod_1.z.coerce.number().int().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    // Null/omitted means "no restriction" — the product form shows every field.
    enabledFields: zod_1.z.array(zod_1.z.string()).nullable().optional(),
});
exports.categoryUpdateSchema = exports.categoryCreateSchema.partial();
//# sourceMappingURL=category.schema.js.map