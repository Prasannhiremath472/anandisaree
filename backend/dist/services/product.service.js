"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.softDeleteProduct = softDeleteProduct;
exports.bulkDeleteProducts = bulkDeleteProducts;
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
async function listProducts(pagination, filters) {
    const where = {
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
    const orderBy = filters.sortBy
        ? { [filters.sortBy]: filters.sortOrder ?? "desc" }
        : { createdAt: "desc" };
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
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
        prisma_1.prisma.product.count({ where }),
    ]);
    return (0, pagination_1.buildPaginatedResult)(items, total, pagination);
}
async function getProductById(id) {
    const product = await prisma_1.prisma.product.findFirst({
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
    if (!product)
        throw ApiError_1.ApiError.notFound("Product not found");
    return product;
}
async function createProduct(input) {
    const existingSku = await prisma_1.prisma.product.findUnique({ where: { sku: input.sku } });
    if (existingSku)
        throw ApiError_1.ApiError.conflict("A product with this SKU already exists");
    const existingSlug = await prisma_1.prisma.product.findUnique({ where: { slug: input.slug } });
    if (existingSlug)
        throw ApiError_1.ApiError.conflict("A product with this slug already exists");
    const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;
    if (variants?.length) {
        const skus = variants.map((v) => v.sku);
        const existingVariantSku = await prisma_1.prisma.productVariant.findFirst({ where: { sku: { in: skus } } });
        if (existingVariantSku)
            throw ApiError_1.ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
    }
    const product = await prisma_1.prisma.product.create({
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
async function updateProduct(id, input) {
    await getProductById(id);
    const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;
    if (input.sku) {
        const existing = await prisma_1.prisma.product.findFirst({ where: { sku: input.sku, NOT: { id } } });
        if (existing)
            throw ApiError_1.ApiError.conflict("A product with this SKU already exists");
    }
    if (variants?.length) {
        const skus = variants.map((v) => v.sku);
        const existingVariantSku = await prisma_1.prisma.productVariant.findFirst({
            where: { sku: { in: skus }, productId: { not: id } },
        });
        if (existingVariantSku)
            throw ApiError_1.ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
    }
    const product = await prisma_1.prisma.product.update({
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
async function softDeleteProduct(id) {
    await getProductById(id);
    await prisma_1.prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
}
async function bulkDeleteProducts(ids) {
    await prisma_1.prisma.product.updateMany({ where: { id: { in: ids } }, data: { deletedAt: new Date(), isActive: false } });
}
//# sourceMappingURL=product.service.js.map