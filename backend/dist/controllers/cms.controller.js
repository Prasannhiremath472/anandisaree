"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.createBlogPost = exports.getBlogPost = exports.listBlogPosts = exports.upsertCmsPage = exports.getCmsPage = exports.listCmsPages = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const cms_schema_1 = require("../validation/cms.schema");
const CMS_PAGE_COLUMNS = ["title", "contentHtml", "metaTitle", "metaDescription"];
const BLOG_POST_COLUMNS = [
    "title",
    "slug",
    "excerpt",
    "contentHtml",
    "coverImageUrl",
    "categoryName",
    "tags",
    "metaTitle",
    "metaDescription",
    "isPublished",
    "publishedAt",
];
// CMS Pages (static site content: home, about, contact, privacy, terms, faq)
exports.listCmsPages = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const pages = await (0, db_1.query)("SELECT * FROM `CmsPage` ORDER BY slug ASC");
    res.json({ success: true, data: pages });
});
exports.getCmsPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = await (0, db_1.queryOne)("SELECT * FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);
    if (!page)
        throw ApiError_1.ApiError.notFound("CMS page not found");
    res.json({ success: true, data: page });
});
exports.upsertCmsPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.cmsPageUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);
    const columns = CMS_PAGE_COLUMNS.filter((col) => input[col] !== undefined);
    const values = columns.map((col) => input[col]);
    if (existing) {
        if (columns.length) {
            await (0, db_1.execute)(`UPDATE \`CmsPage\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE slug = ?`, [...values, req.params.slug]);
        }
    }
    else {
        await (0, db_1.execute)(`INSERT INTO \`CmsPage\` (id, slug, ${columns.map((c) => `\`${c}\``).join(", ")}, updatedAt)
       VALUES (?, ?, ${columns.map(() => "?").join(", ")}, NOW(3))`, [(0, id_1.createId)(), req.params.slug, ...values]);
    }
    const page = await (0, db_1.queryOne)("SELECT * FROM `CmsPage` WHERE slug = ? LIMIT 1", [req.params.slug]);
    res.json({ success: true, data: page });
});
// Blog Posts
exports.listBlogPosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const search = req.query.search;
    const whereClause = search ? "title LIKE ?" : "1=1";
    const params = search ? [`%${search}%`] : [];
    const items = await (0, db_1.query)(`SELECT * FROM \`BlogPost\` WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`BlogPost\` WHERE ${whereClause}`, params);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, totalRow?.count ?? 0, pagination) });
});
exports.getBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const post = await (0, db_1.queryOne)("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [
        req.params.id,
    ]);
    if (!post)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    const comments = await (0, db_1.query)("SELECT * FROM `BlogComment` WHERE postId = ? ORDER BY createdAt DESC", [
        req.params.id,
    ]);
    res.json({ success: true, data: { ...post, comments } });
});
exports.createBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.blogPostCreateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `BlogPost` WHERE slug = ? LIMIT 1", [input.slug]);
    if (existing)
        throw ApiError_1.ApiError.conflict("A blog post with this slug already exists");
    const id = (0, id_1.createId)();
    const data = { ...input, publishedAt: input.isPublished ? new Date() : null };
    const columns = BLOG_POST_COLUMNS.filter((col) => data[col] !== undefined);
    const values = columns.map((col) => data[col]);
    await (0, db_1.execute)(`INSERT INTO \`BlogPost\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`, [id, ...values]);
    const post = await (0, db_1.queryOne)("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [id]);
    res.status(201).json({ success: true, data: post });
});
exports.updateBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.blogPostUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT isPublished FROM `BlogPost` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    const data = {
        ...input,
        ...(input.isPublished && !existing.isPublished ? { publishedAt: new Date() } : {}),
    };
    const columns = BLOG_POST_COLUMNS.filter((col) => data[col] !== undefined);
    if (columns.length) {
        const values = columns.map((col) => data[col]);
        await (0, db_1.execute)(`UPDATE \`BlogPost\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [...values, req.params.id]);
    }
    const post = await (0, db_1.queryOne)("SELECT * FROM `BlogPost` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: post });
});
exports.deleteBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `BlogPost` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    await (0, db_1.execute)("DELETE FROM `BlogPost` WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: null, message: "Blog post deleted" });
});
//# sourceMappingURL=cms.controller.js.map