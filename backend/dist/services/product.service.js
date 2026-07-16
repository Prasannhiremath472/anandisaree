"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.softDeleteProduct = softDeleteProduct;
exports.bulkDeleteProducts = bulkDeleteProducts;
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
async function listProducts(pagination, filters) {
    const conditions = ["deletedAt IS NULL"];
    const params = [];
    if (filters.isActive !== undefined) {
        conditions.push("isActive = ?");
        params.push(filters.isActive);
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
    const sortBy = filters.sortBy && SORTABLE_COLUMNS.has(filters.sortBy) ? filters.sortBy : "createdAt";
    const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";
    const whereClause = conditions.join(" AND ");
    const items = await (0, db_1.query)(`SELECT * FROM \`Product\` WHERE ${whereClause} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`, [...params, pagination.take, pagination.skip]);
    const totalRow = await (0, db_1.queryOne)(`SELECT COUNT(*) as count FROM \`Product\` WHERE ${whereClause}`, params);
    const withImages = await attachRelations(items);
    // listProducts previously only included a single primary-sort image per product
    const withPrimaryImage = withImages.map((p) => ({
        ...p,
        images: p.images.slice(0, 1),
    }));
    return (0, pagination_1.buildPaginatedResult)(withPrimaryImage, totalRow?.count ?? 0, pagination);
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
    "isFeatured",
    "isNewArrival",
    "isBestSeller",
    "isTodaysDeal",
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
    const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;
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
    const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input;
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
    await (0, db_1.execute)("UPDATE `Product` SET deletedAt = NOW(3), isActive = 0 WHERE id = ?", [id]);
}
async function bulkDeleteProducts(ids) {
    if (!ids.length)
        return;
    await (0, db_1.execute)(`UPDATE \`Product\` SET deletedAt = NOW(3), isActive = 0 WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
}
//# sourceMappingURL=product.service.js.map