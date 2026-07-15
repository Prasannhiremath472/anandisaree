import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { getPagination, buildPaginatedResult } from "../utils/pagination";
import { blogPostCreateSchema, blogPostUpdateSchema, cmsPageUpdateSchema } from "../validation/cms.schema";
import type { Prisma } from "@prisma/client";

// CMS Pages (static site content: home, about, contact, privacy, terms, faq)
export const listCmsPages = asyncHandler(async (_req: Request, res: Response) => {
  const pages = await prisma.cmsPage.findMany({ orderBy: { slug: "asc" } });
  res.json({ success: true, data: pages });
});

export const getCmsPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await prisma.cmsPage.findUnique({ where: { slug: req.params.slug } });
  if (!page) throw ApiError.notFound("CMS page not found");
  res.json({ success: true, data: page });
});

export const upsertCmsPage = asyncHandler(async (req: Request, res: Response) => {
  const input = cmsPageUpdateSchema.parse(req.body);
  const page = await prisma.cmsPage.upsert({
    where: { slug: req.params.slug },
    update: input,
    create: { slug: req.params.slug, ...input },
  });
  res.json({ success: true, data: page });
});

// Blog Posts
export const listBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req);
  const search = req.query.search as string | undefined;

  const where: Prisma.BlogPostWhereInput = search ? { title: { contains: search } } : {};

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip: pagination.skip, take: pagination.take }),
    prisma.blogPost.count({ where }),
  ]);

  res.json({ success: true, data: buildPaginatedResult(items, total, pagination) });
});

export const getBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
    include: { comments: { orderBy: { createdAt: "desc" } } },
  });
  if (!post) throw ApiError.notFound("Blog post not found");
  res.json({ success: true, data: post });
});

export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = blogPostCreateSchema.parse(req.body);
  const existing = await prisma.blogPost.findUnique({ where: { slug: input.slug } });
  if (existing) throw ApiError.conflict("A blog post with this slug already exists");

  const post = await prisma.blogPost.create({
    data: { ...input, publishedAt: input.isPublished ? new Date() : null },
  });
  res.status(201).json({ success: true, data: post });
});

export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = blogPostUpdateSchema.parse(req.body);
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Blog post not found");

  const post = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: {
      ...input,
      ...(input.isPublished && !existing.isPublished ? { publishedAt: new Date() } : {}),
    },
  });
  res.json({ success: true, data: post });
});

export const deleteBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound("Blog post not found");

  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: null, message: "Blog post deleted" });
});
