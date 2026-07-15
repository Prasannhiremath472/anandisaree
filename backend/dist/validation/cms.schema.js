"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostUpdateSchema = exports.blogPostCreateSchema = exports.cmsPageUpdateSchema = void 0;
const zod_1 = require("zod");
exports.cmsPageUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    contentHtml: zod_1.z.string().min(1),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
});
exports.blogPostCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2),
    excerpt: zod_1.z.string().optional(),
    contentHtml: zod_1.z.string().min(1),
    coverImageUrl: zod_1.z.string().optional(),
    categoryName: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.blogPostUpdateSchema = exports.blogPostCreateSchema.partial();
//# sourceMappingURL=cms.schema.js.map