"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.listAllProductsForExport = listAllProductsForExport;
exports.listPublicProducts = listPublicProducts;
exports.getProductBySlug = getProductBySlug;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.softDeleteProduct = softDeleteProduct;
exports.bulkDeleteProducts = bulkDeleteProducts;
exports.updateProductStatus = updateProductStatus;
exports.listTrashedProducts = listTrashedProducts;
exports.restoreProduct = restoreProduct;
exports.permanentlyDeleteProduct = permanentlyDeleteProduct;
exports.generateNextSku = generateNextSku;
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const SORTABLE_COLUMNS = new Set([
    "createdAt",
    "updatedAt",
    "name",
    "sellingPrice",
    "mrp",
    "stockQuantity",
    "avgRating",
    "soldCount",
    "viewCount",
]);
async function attachRelations(products) {
    if (products.length === 0)
        return [];
    const ids = products.map((p) => p.id);
    const placeholders = ids.map(() => "?").join(",");
    const images = await (0, db_1.query)(`SELECT * FROM \`ProductImage\` WHERE productId IN (${placeholders}) ORDER BY sortOrder ASC`, ids);
    const categoryLinks = await (0, db_1.query)(`SELECT pc.productId, pc.categoryId, c.id, c.name, c.slug, c.\`group\`, c.parentId
     FROM \`ProductCategory\` pc JOIN \`Category\` c ON c.id = pc.categoryId
     WHERE pc.productId IN (${placeholders})`, ids);
    const brandIds = products.map((p) => p.brandId).filter((b) => Boolean(b));
    const brands = brandIds.length
        ? await (0, db_1.query)(`SELECT * FROM \`Brand\` WHERE id IN (${brandIds.map(() => "?").join(",")})`, brandIds)
        : [];
    return products.map((product) => ({
        ...product,
        images: images.filter((img) => img.productId === product.id),
        categories: categoryLinks
            .filter((c) => c.productId === product.id)
            .map((c) => ({
            productId: c.productId,
            categoryId: c.categoryId,
            category: { id: c.id, name: c.name, slug: c.slug, group: c.group, parentId: c.parentId },
        })),
        brand: brands.find((b) => b.id === product.brandId) ?? null,
    }));
}
function buildProductListWhere(filters) {
    const conditions = [filters.trashed ? "deletedAt IS NOT NULL" : "deletedAt IS NULL"];
    const params = [];
    if (filters.isActive !== undefined) {
        conditions.push("isActive = ?");
        params.push(filters.isActive);
    }
    if (filters.status) {
        conditions.push("status = ?");
        params.push(filters.status);
    }
    if (filters.fabric) {
        conditions.push("fabric = ?");
        params.push(filters.fabric);
    }
    if (filters.lowStockOnly) {
        conditions.push("stockQuantity <= lowStockThreshold");
    }
    if (filters.categoryId) {
        conditions.push("id IN (SELECT productId FROM `ProductCategory` WHERE categoryId = ?)");
        params.push(filters.categoryId);
    }
    if (filters.search) {
        conditions.push("(name LIKE ? OR sku LIKE ? OR fabric LIKE ?)");
        const like = `%${filters.search}%`;
        params.push(like, like, like);
    }
    return { whereClause: conditions.join(" AND "), params };
}
async function listProducts(pagination, filters) {
    const { whereClause, params } = buildProductListWhere(filters);
    const sortBy = filters.sortBy && SORTABLE_COLUMNS.has(filters.sortBy) ? filters.sortBy : "createdAt";
    const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";
    const items = await (0, db_1.query)(`SELECT * FROM \`Product\` WHERE ${whereClause} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Product\` WHERE ${whereClause}`, params);
    const withImages = await attachRelations(items);
    // listProducts previously only included a single primary-sort image per product
    const withPrimaryImage = withImages.map((p) => ({
        ...p,
        images: toThumbnailImages(p.images),
    }));
    return (0, pagination_1.buildPaginatedResult)(withPrimaryImage, totalRow?.count ?? 0, pagination);
}
async function listAllProductsForExport(filters) {
    const { whereClause, params } = buildProductListWhere(filters);
    const products = await (0, db_1.query)(`SELECT id, sku, name, fabric, color, mrp, sellingPrice, stockQuantity, status, createdAt FROM \`Product\` WHERE ${whereClause} ORDER BY createdAt DESC`, params);
    if (products.length === 0)
        return [];
    const ids = products.map((p) => p.id);
    const categoryLinks = await (0, db_1.query)(`SELECT pc.productId, c.name FROM \`ProductCategory\` pc JOIN \`Category\` c ON c.id = pc.categoryId
     WHERE pc.productId IN (${ids.map(() => "?").join(",")})`, ids);
    return products.map((p) => ({
        ...p,
        categoryNames: categoryLinks
            .filter((c) => c.productId === p.id)
            .map((c) => c.name)
            .join("; "),
    }));
}
/** List/grid views only need one small image, not the full-resolution data URI. */
function toThumbnailImages(images) {
    const primary = images[0];
    if (!primary)
        return [];
    return [{ ...primary, url: primary.thumbnailUrl ?? primary.url }];
}
async function listPublicProducts(pagination, filters) {
    const conditions = ["deletedAt IS NULL", "isActive = 1"];
    const params = [];
    if (filters.categoryId) {
        conditions.push("id IN (SELECT productId FROM `ProductCategory` WHERE categoryId = ?)");
        params.push(filters.categoryId);
    }
    if (filters.search) {
        conditions.push("(name LIKE ? OR fabric LIKE ?)");
        const like = `%${filters.search}%`;
        params.push(like, like);
    }
    if (filters.isNewArrival)
        conditions.push("isNewArrival = 1");
    if (filters.isBestSeller)
        conditions.push("isBestSeller = 1");
    if (filters.isFeatured)
        conditions.push("isFeatured = 1");
    if (filters.isLiveSpecial)
        conditions.push("isLiveSpecial = 1");
    if (filters.isTopSelection)
        conditions.push("isTopSelection = 1");
    const sortBy = filters.sortBy && SORTABLE_COLUMNS.has(filters.sortBy) ? filters.sortBy : "createdAt";
    const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";
    const whereClause = conditions.join(" AND ");
    const items = await (0, db_1.query)(`SELECT * FROM \`Product\` WHERE ${whereClause} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Product\` WHERE ${whereClause}`, params);
    const withImages = await attachRelations(items);
    const withPrimaryImage = withImages.map((p) => ({
        ...p,
        images: toThumbnailImages(p.images),
    }));
    return (0, pagination_1.buildPaginatedResult)(withPrimaryImage, totalRow?.count ?? 0, pagination);
}
async function getProductBySlug(slug) {
    const product = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE slug = ? AND deletedAt IS NULL AND isActive = 1 LIMIT 1", [slug]);
    if (!product)
        throw ApiError_1.ApiError.notFound("Product not found");
    return getProductById(product.id);
}
async function getProductById(id) {
    const product = await (0, db_1.queryOne)("SELECT * FROM `Product` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [id]);
    if (!product)
        throw ApiError_1.ApiError.notFound("Product not found");
    const videos = await (0, db_1.query)("SELECT * FROM `ProductVideo` WHERE productId = ?", [id]);
    const variants = await (0, db_1.query)("SELECT * FROM `ProductVariant` WHERE productId = ?", [id]);
    const collectionLinks = await (0, db_1.query)(`SELECT pc.productId, pc.collectionId, c.id, c.name, c.slug
     FROM \`ProductCollection\` pc JOIN \`Collection\` c ON c.id = pc.collectionId
     WHERE pc.productId = ?`, [id]);
    const occasionLinks = await (0, db_1.query)(`SELECT po.productId, po.occasionId, o.id, o.name, o.slug
     FROM \`ProductOccasion\` po JOIN \`Occasion\` o ON o.id = po.occasionId
     WHERE po.productId = ?`, [id]);
    const tagLinks = await (0, db_1.query)(`SELECT pt.productId, pt.tagId, t.id, t.name, t.slug
     FROM \`ProductTagAssignment\` pt JOIN \`ProductTag\` t ON t.id = pt.tagId
     WHERE pt.productId = ?`, [id]);
    const [withCategoryAndImages] = await attachRelations([product]);
    return {
        ...withCategoryAndImages,
        videos,
        variants,
        collections: collectionLinks.map((c) => ({
            productId: c.productId,
            collectionId: c.collectionId,
            collection: { id: c.id, name: c.name, slug: c.slug },
        })),
        occasions: occasionLinks.map((o) => ({
            productId: o.productId,
            occasionId: o.occasionId,
            occasion: { id: o.id, name: o.name, slug: o.slug },
        })),
        tags: tagLinks.map((t) => ({
            productId: t.productId,
            tagId: t.tagId,
            tag: { id: t.id, name: t.name, slug: t.slug },
        })),
    };
}
const PRODUCT_COLUMNS = [
    "sku",
    "name",
    "slug",
    "shortDescription",
    "description",
    "brandId",
    "fabric",
    "weavingTechnique",
    "isHandloom",
    "borderType",
    "palluDesign",
    "designPattern",
    "color",
    "secondaryColors",
    "sareeLength",
    "blouseIncluded",
    "blouseLength",
    "weightGrams",
    "craftOrigin",
    "state",
    "district",
    "weaverDetails",
    "mrp",
    "sellingPrice",
    "gstPercent",
    "stockQuantity",
    "lowStockThreshold",
    "dispatchDays",
    "deliveryEstimateDays",
    "washCare",
    "isActive",
    "status",
    "isFeatured",
    "isNewArrival",
    "isBestSeller",
    "isTodaysDeal",
    "isLiveSpecial",
    "isTopSelection",
    "publishedAt",
    "metaTitle",
    "metaDescription",
];
async function createProduct(input) {
    const existingSku = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE sku = ? LIMIT 1", [input.sku]);
    if (existingSku)
        throw ApiError_1.ApiError.conflict("A product with this SKU already exists");
    const existingSlug = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE slug = ? LIMIT 1", [input.slug]);
    if (existingSlug)
        throw ApiError_1.ApiError.conflict("A product with this slug already exists");
    const { categoryIds, collectionIds, occasionIds, tagIds, images, variants, ...productData } = input;
    if (variants?.length) {
        const skus = variants.map((v) => v.sku);
        const existingVariantSku = await (0, db_1.queryOne)(`SELECT sku FROM \`ProductVariant\` WHERE sku IN (${skus.map(() => "?").join(",")}) LIMIT 1`, skus);
        if (existingVariantSku)
            throw ApiError_1.ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
    }
    const productId = (0, id_1.createId)();
    await (0, db_1.withTransaction)(async (conn) => {
        const columns = PRODUCT_COLUMNS.filter((col) => productData[col] !== undefined);
        const values = columns.map((col) => productData[col]);
        await conn.query(`INSERT INTO \`Product\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
       VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`, [productId, ...values]);
        const categoryIdList = categoryIds;
        if (categoryIdList?.length) {
            for (const categoryId of categoryIdList) {
                await conn.query("INSERT INTO `ProductCategory` (productId, categoryId) VALUES (?, ?)", [productId, categoryId]);
            }
        }
        const collectionIdList = collectionIds;
        if (collectionIdList?.length) {
            for (const collectionId of collectionIdList) {
                await conn.query("INSERT INTO `ProductCollection` (productId, collectionId) VALUES (?, ?)", [productId, collectionId]);
            }
        }
        const occasionIdList = occasionIds;
        if (occasionIdList?.length) {
            for (const occasionId of occasionIdList) {
                await conn.query("INSERT INTO `ProductOccasion` (productId, occasionId) VALUES (?, ?)", [productId, occasionId]);
            }
        }
        const tagIdList = tagIds;
        if (tagIdList?.length) {
            for (const tagId of tagIdList) {
                await conn.query("INSERT INTO `ProductTagAssignment` (productId, tagId) VALUES (?, ?)", [productId, tagId]);
            }
        }
        const imageList = images;
        if (imageList?.length) {
            for (let i = 0; i < imageList.length; i++) {
                const img = imageList[i];
                await conn.query("INSERT INTO `ProductImage` (id, productId, url, altText, isPrimary, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW(3))", [(0, id_1.createId)(), productId, img.url, img.altText ?? null, img.isPrimary ?? i === 0, i]);
            }
        }
        const variantList = variants;
        if (variantList?.length) {
            for (const variant of variantList) {
                await conn.query("INSERT INTO `ProductVariant` (id, productId, sku, color, size, priceDelta, stockQuantity, barcode, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))", [
                    (0, id_1.createId)(),
                    productId,
                    variant.sku,
                    variant.color ?? null,
                    variant.size ?? null,
                    variant.priceDelta ?? 0,
                    variant.stockQuantity ?? 0,
                    variant.barcode ?? null,
                    variant.imageUrl ?? null,
                ]);
            }
        }
    });
    return getProductById(productId);
}
async function updateProduct(id, input) {
    await getProductById(id);
    const { categoryIds, collectionIds, occasionIds, tagIds, images, variants, ...productData } = input;
    if (input.sku) {
        const existing = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE sku = ? AND id != ? LIMIT 1", [input.sku, id]);
        if (existing)
            throw ApiError_1.ApiError.conflict("A product with this SKU already exists");
    }
    if (variants?.length) {
        const skus = variants.map((v) => v.sku);
        const existingVariantSku = await (0, db_1.queryOne)(`SELECT sku FROM \`ProductVariant\` WHERE sku IN (${skus.map(() => "?").join(",")}) AND productId != ? LIMIT 1`, [...skus, id]);
        if (existingVariantSku)
            throw ApiError_1.ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
    }
    await (0, db_1.withTransaction)(async (conn) => {
        const columns = PRODUCT_COLUMNS.filter((col) => productData[col] !== undefined);
        if (columns.length) {
            const values = columns.map((col) => productData[col]);
            await conn.query(`UPDATE \`Product\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [...values, id]);
        }
        const categoryIdList = categoryIds;
        if (categoryIdList) {
            await conn.query("DELETE FROM `ProductCategory` WHERE productId = ?", [id]);
            for (const categoryId of categoryIdList) {
                await conn.query("INSERT INTO `ProductCategory` (productId, categoryId) VALUES (?, ?)", [id, categoryId]);
            }
        }
        const collectionIdList = collectionIds;
        if (collectionIdList) {
            await conn.query("DELETE FROM `ProductCollection` WHERE productId = ?", [id]);
            for (const collectionId of collectionIdList) {
                await conn.query("INSERT INTO `ProductCollection` (productId, collectionId) VALUES (?, ?)", [id, collectionId]);
            }
        }
        const occasionIdList = occasionIds;
        if (occasionIdList) {
            await conn.query("DELETE FROM `ProductOccasion` WHERE productId = ?", [id]);
            for (const occasionId of occasionIdList) {
                await conn.query("INSERT INTO `ProductOccasion` (productId, occasionId) VALUES (?, ?)", [id, occasionId]);
            }
        }
        const tagIdList = tagIds;
        if (tagIdList) {
            await conn.query("DELETE FROM `ProductTagAssignment` WHERE productId = ?", [id]);
            for (const tagId of tagIdList) {
                await conn.query("INSERT INTO `ProductTagAssignment` (productId, tagId) VALUES (?, ?)", [id, tagId]);
            }
        }
        const imageList = images;
        if (imageList) {
            await conn.query("DELETE FROM `ProductImage` WHERE productId = ?", [id]);
            for (let i = 0; i < imageList.length; i++) {
                const img = imageList[i];
                await conn.query("INSERT INTO `ProductImage` (id, productId, url, altText, isPrimary, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW(3))", [(0, id_1.createId)(), id, img.url, img.altText ?? null, img.isPrimary ?? i === 0, i]);
            }
        }
        const variantList = variants;
        if (variantList) {
            await conn.query("DELETE FROM `ProductVariant` WHERE productId = ?", [id]);
            for (const variant of variantList) {
                await conn.query("INSERT INTO `ProductVariant` (id, productId, sku, color, size, priceDelta, stockQuantity, barcode, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))", [
                    (0, id_1.createId)(),
                    id,
                    variant.sku,
                    variant.color ?? null,
                    variant.size ?? null,
                    variant.priceDelta ?? 0,
                    variant.stockQuantity ?? 0,
                    variant.barcode ?? null,
                    variant.imageUrl ?? null,
                ]);
            }
        }
    });
    return getProductById(id);
}
async function softDeleteProduct(id) {
    await getProductById(id);
    await (0, db_1.execute)("UPDATE `Product` SET deletedAt = NOW(3), isActive = 0, status = 'INACTIVE' WHERE id = ?", [id]);
}
async function bulkDeleteProducts(ids) {
    if (!ids.length)
        return;
    await (0, db_1.execute)(`UPDATE \`Product\` SET deletedAt = NOW(3), isActive = 0, status = 'INACTIVE' WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
}
async function updateProductStatus(id, status) {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Product not found");
    await (0, db_1.execute)("UPDATE `Product` SET status = ?, isActive = ?, updatedAt = NOW(3) WHERE id = ?", [
        status,
        status === "INACTIVE" ? 0 : 1,
        id,
    ]);
    return getProductById(id);
}
async function listTrashedProducts(pagination, filters) {
    return listProducts(pagination, { ...filters, trashed: true });
}
async function restoreProduct(id) {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE id = ? AND deletedAt IS NOT NULL LIMIT 1", [id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Trashed product not found");
    await (0, db_1.execute)("UPDATE `Product` SET deletedAt = NULL, isActive = 1, status = 'ACTIVE' WHERE id = ?", [id]);
    return getProductById(id);
}
async function permanentlyDeleteProduct(id) {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Product` WHERE id = ? AND deletedAt IS NOT NULL LIMIT 1", [id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Trashed product not found");
    const orderItemCount = await (0, db_1.queryOne)("SELECT COUNT(*) as count FROM `OrderItem` WHERE productId = ?", [id]);
    if ((orderItemCount?.count ?? 0) > 0) {
        throw ApiError_1.ApiError.conflict("This product is referenced by past orders and cannot be permanently deleted");
    }
    await (0, db_1.withTransaction)(async (conn) => {
        await conn.query("DELETE FROM `ProductImage` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `ProductVideo` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `ProductVariant` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `ProductCategory` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `ProductCollection` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `ProductOccasion` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `StockMovement` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `CartItem` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `WishlistItem` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `RecentlyViewed` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `Review` WHERE productId = ?", [id]);
        await conn.query("DELETE FROM `Product` WHERE id = ?", [id]);
    });
}
const CATEGORY_SKU_CODE_LENGTH = 3;
async function generateNextSku(categoryId) {
    const category = await (0, db_1.queryOne)("SELECT slug FROM `Category` WHERE id = ? LIMIT 1", [categoryId]);
    if (!category)
        throw ApiError_1.ApiError.notFound("Category not found");
    const code = category.slug.replace(/[^a-zA-Z]/g, "").slice(0, CATEGORY_SKU_CODE_LENGTH).toUpperCase().padEnd(CATEGORY_SKU_CODE_LENGTH, "X");
    const prefix = `ANS-${code}-`;
    const last = await (0, db_1.queryOne)("SELECT sku FROM `Product` WHERE sku LIKE ? ORDER BY sku DESC LIMIT 1", [`${prefix}%`]);
    let nextNumber = 1;
    if (last) {
        const match = last.sku.match(/(\d+)$/);
        if (match)
            nextNumber = parseInt(match[1], 10) + 1;
    }
    return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}
//# sourceMappingURL=product.service.js.map