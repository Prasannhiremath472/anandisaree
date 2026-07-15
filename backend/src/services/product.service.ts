import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, getPagination, PaginationParams } from "../utils/pagination";
import type { ProductCreateInput, ProductUpdateInput } from "../validation/product.schema";

interface ListFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function listProducts(pagination: PaginationParams, filters: ListFilters) {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    ...(filters.categoryId ? { categories: { some: { categoryId: filters.categoryId } } } : {}),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search } },
            { sku: { contains: filters.search } },
            { fabric: { contains: filters.search } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput = filters.sortBy
    ? { [filters.sortBy]: filters.sortOrder ?? "desc" }
    : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        categories: { include: { category: true } },
        brand: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return buildPaginatedResult(items, total, pagination);
}

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: true,
      variants: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
      occasions: { include: { occasion: true } },
      brand: true,
    },
  });

  if (!product) throw ApiError.notFound("Product not found");
  return product;
}

export async function createProduct(input: ProductCreateInput) {
  const existingSku = await prisma.product.findUnique({ where: { sku: input.sku } });
  if (existingSku) throw ApiError.conflict("A product with this SKU already exists");

  const existingSlug = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (existingSlug) throw ApiError.conflict("A product with this slug already exists");

  const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;

  if (variants?.length) {
    const skus = variants.map((v) => v.sku);
    const existingVariantSku = await prisma.productVariant.findFirst({ where: { sku: { in: skus } } });
    if (existingVariantSku) throw ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
  }

  const product = await prisma.product.create({
    data: {
      ...productData,
      categories: categoryIds ? { create: categoryIds.map((categoryId) => ({ categoryId })) } : undefined,
      collections: collectionIds ? { create: collectionIds.map((collectionId) => ({ collectionId })) } : undefined,
      occasions: occasionIds ? { create: occasionIds.map((occasionId) => ({ occasionId })) } : undefined,
      images: images
        ? { create: images.map((img, i) => ({ url: img.url, altText: img.altText, isPrimary: img.isPrimary ?? i === 0, sortOrder: i })) }
        : undefined,
      variants: variants ? { create: variants } : undefined,
    },
    include: { images: true, categories: { include: { category: true } }, variants: true },
  });

  return product;
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  await getProductById(id);

  const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;

  if (input.sku) {
    const existing = await prisma.product.findFirst({ where: { sku: input.sku, NOT: { id } } });
    if (existing) throw ApiError.conflict("A product with this SKU already exists");
  }

  if (variants?.length) {
    const skus = variants.map((v) => v.sku);
    const existingVariantSku = await prisma.productVariant.findFirst({
      where: { sku: { in: skus }, productId: { not: id } },
    });
    if (existingVariantSku) throw ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(categoryIds
        ? { categories: { deleteMany: {}, create: categoryIds.map((categoryId) => ({ categoryId })) } }
        : {}),
      ...(collectionIds
        ? { collections: { deleteMany: {}, create: collectionIds.map((collectionId) => ({ collectionId })) } }
        : {}),
      ...(occasionIds
        ? { occasions: { deleteMany: {}, create: occasionIds.map((occasionId) => ({ occasionId })) } }
        : {}),
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images.map((img, i) => ({ url: img.url, altText: img.altText, isPrimary: img.isPrimary ?? i === 0, sortOrder: i })),
            },
          }
        : {}),
      ...(variants
        ? {
            variants: {
              deleteMany: {},
              create: variants,
            },
          }
        : {}),
    },
    include: { images: true, categories: { include: { category: true } }, variants: true },
  });

  return product;
}

export async function softDeleteProduct(id: string) {
  await getProductById(id);
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
}

export async function bulkDeleteProducts(ids: string[]) {
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date(), isActive: false } });
}
