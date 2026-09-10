"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reelUpdateSchema = exports.reelCreateSchema = void 0;
const zod_1 = require("zod");
exports.reelCreateSchema = zod_1.z.object({
    caption: zod_1.z.string().min(1),
    videoUrl: zod_1.z.string().min(1),
    thumbnailUrl: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    linkUrl: zod_1.z.string().optional(),
    sortOrder: zod_1.z.coerce.number().int().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
exports.reelUpdateSchema = exports.reelCreateSchema.partial();
//# sourceMappingURL=reel.schema.js.map