"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.createBlogPost = exports.getBlogPost = exports.listBlogPosts = exports.upsertCmsPage = exports.getCmsPage = exports.listCmsPages = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const cms_schema_1 = require("../validation/cms.schema");
// CMS Pages (static site content: home, about, contact, privacy, terms, faq)
exports.listCmsPages = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const pages = await prisma_1.prisma.cmsPage.findMany({ orderBy: { slug: "asc" } });
    res.json({ success: true, data: pages });
});
exports.getCmsPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = await prisma_1.prisma.cmsPage.findUnique({ where: { slug: req.params.slug } });
    if (!page)
        throw ApiError_1.ApiError.notFound("CMS page not found");
    res.json({ success: true, data: page });
});
exports.upsertCmsPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.cmsPageUpdateSchema.parse(req.body);
    const page = await prisma_1.prisma.cmsPage.upsert({
        where: { slug: req.params.slug },
        update: input,
        create: { slug: req.params.slug, ...input },
    });
    res.json({ success: true, data: page });
});
// Blog Posts
exports.listBlogPosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const pagination = (0, pagination_1.getPagination)(req);
    const search = req.query.search;
    const where = search ? { title: { contains: search } } : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip: pagination.skip, take: pagination.take }),
        prisma_1.prisma.blogPost.count({ where }),
    ]);
    res.json({ success: true, data: (0, pagination_1.buildPaginatedResult)(items, total, pagination) });
});
exports.getBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const post = await prisma_1.prisma.blogPost.findUnique({
        where: { id: req.params.id },
        include: { comments: { orderBy: { createdAt: "desc" } } },
    });
    if (!post)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    res.json({ success: true, data: post });
});
exports.createBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.blogPostCreateSchema.parse(req.body);
    const existing = await prisma_1.prisma.blogPost.findUnique({ where: { slug: input.slug } });
    if (existing)
        throw ApiError_1.ApiError.conflict("A blog post with this slug already exists");
    const post = await prisma_1.prisma.blogPost.create({
        data: { ...input, publishedAt: input.isPublished ? new Date() : null },
    });
    res.status(201).json({ success: true, data: post });
});
exports.updateBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = cms_schema_1.blogPostUpdateSchema.parse(req.body);
    const existing = await prisma_1.prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    const post = await prisma_1.prisma.blogPost.update({
        where: { id: req.params.id },
        data: {
            ...input,
            ...(input.isPublished && !existing.isPublished ? { publishedAt: new Date() } : {}),
        },
    });
    res.json({ success: true, data: post });
});
exports.deleteBlogPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await prisma_1.prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Blog post not found");
    await prisma_1.prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null, message: "Blog post deleted" });
});
//# sourceMappingURL=cms.controller.js.map