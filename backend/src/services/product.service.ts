import sharp from "sharp";
import { query, queryOne, execute, withTransaction, QueryParams } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import { buildPaginatedResult, PaginationParams } from "../utils/pagination";
import type { ProductCreateInput, ProductUpdateInput } from "../validation/product.schema";

const THUMBNAIL_WIDTH = 320;
const THUMBNAIL_JPEG_QUALITY = 72;

/** Generates a small JPEG data URI for list/grid views from a full-size data URI. Returns null for non-data-URI (external) image URLs. */
async function generateThumbnail(url: string): Promise<string | null> {
  const match = /^data:image\/\w+;base64,(.+)$/.exec(url);
  if (!match) return null;
  try {
    const buf = Buffer.from(match[1], "base64");
    const thumbBuf = await sharp(buf)
      .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: THUMBNAIL_JPEG_QUALITY })
      .toBuffer();
    return `data:image/jpeg;base64,${thumbBuf.toString("base64")}`;
  } catch {
    return null;
  }
}

interface ListFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

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

async function attachRelations(products: Record<string, unknown>[]) {
  if (products.length === 0) return [];
  const ids = products.map((p) => p.id as string);
  const placeholders = ids.map(() => "?").join(",");

  const images = await query<Record<string, unknown>>(
    `SELECT * FROM \`ProductImage\` WHERE productId IN (${placeholders}) ORDER BY sortOrder ASC`,
    ids
  );
  const categoryLinks = await query<{ productId: string; categoryId: string; id: string; name: string; slug: string; group: string; parentId: string | null }>(
    `SELECT pc.productId, pc.categoryId, c.id, c.name, c.slug, c.\`group\`, c.parentId
     FROM \`ProductCategory\` pc JOIN \`Category\` c ON c.id = pc.categoryId
     WHERE pc.productId IN (${placeholders})`,
    ids
  );
  const brandIds = products.map((p) => p.brandId as string | null).filter((b): b is string => Boolean(b));
  const brands = brandIds.length
    ? await query<Record<string, unknown>>(
        `SELECT * FROM \`Brand\` WHERE id IN (${brandIds.map(() => "?").join(",")})`,
        brandIds
      )
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

export async function listProducts(pagination: PaginationParams, filters: ListFilters) {
  const conditions: string[] = ["deletedAt IS NULL"];
  const params: QueryParams = [];

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

  const items = await query<Record<string, unknown>>(
    `SELECT * FROM \`Product\` WHERE ${whereClause} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`Product\` WHERE ${whereClause}`,
    params
  );

  const withImages = await attachRelations(items);
  // listProducts previously only included a single primary-sort image per product
  const withPrimaryImage = withImages.map((p) => ({
    ...p,
    images: toThumbnailImages(p.images as Record<string, unknown>[]),
  }));

  return buildPaginatedResult(withPrimaryImage, totalRow?.count ?? 0, pagination);
}

/** List/grid views only need one small image, not the full-resolution data URI. */
function toThumbnailImages(images: Record<string, unknown>[]) {
  const primary = images[0];
  if (!primary) return [];
  return [{ ...primary, url: primary.thumbnailUrl ?? primary.url }];
}

interface PublicListFilters {
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export async function listPublicProducts(pagination: PaginationParams, filters: PublicListFilters) {
  const conditions: string[] = ["deletedAt IS NULL", "isActive = 1"];
  const params: QueryParams = [];

  if (filters.categoryId) {
    conditions.push("id IN (SELECT productId FROM `ProductCategory` WHERE categoryId = ?)");
    params.push(filters.categoryId);
  }
  if (filters.search) {
    conditions.push("(name LIKE ? OR fabric LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like);
  }
  if (filters.isNewArrival) conditions.push("isNewArrival = 1");
  if (filters.isBestSeller) conditions.push("isBestSeller = 1");
  if (filters.isFeatured) conditions.push("isFeatured = 1");

  const sortBy = filters.sortBy && SORTABLE_COLUMNS.has(filters.sortBy) ? filters.sortBy : "createdAt";
  const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";
  const whereClause = conditions.join(" AND ");

  const items = await query<Record<string, unknown>>(
    `SELECT * FROM \`Product\` WHERE ${whereClause} ORDER BY \`${sortBy}\` ${sortOrder} LIMIT ? OFFSET ?`,
    [...params, pagination.take, pagination.skip]
  );
  const totalRow = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM \`Product\` WHERE ${whereClause}`,
    params
  );

  const withImages = await attachRelations(items);
  const withPrimaryImage = withImages.map((p) => ({
    ...p,
    images: toThumbnailImages(p.images as Record<string, unknown>[]),
  }));

  return buildPaginatedResult(withPrimaryImage, totalRow?.count ?? 0, pagination);
}

export async function getProductBySlug(slug: string) {
  const product = await queryOne<{ id: string }>(
    "SELECT id FROM `Product` WHERE slug = ? AND deletedAt IS NULL AND isActive = 1 LIMIT 1",
    [slug]
  );
  if (!product) throw ApiError.notFound("Product not found");
  return getProductById(product.id);
}

export async function getProductById(id: string) {
  const product = await queryOne<Record<string, unknown>>(
    "SELECT * FROM `Product` WHERE id = ? AND deletedAt IS NULL LIMIT 1",
    [id]
  );
  if (!product) throw ApiError.notFound("Product not found");

  const videos = await query<Record<string, unknown>>("SELECT * FROM `ProductVideo` WHERE productId = ?", [id]);
  const variants = await query<Record<string, unknown>>("SELECT * FROM `ProductVariant` WHERE productId = ?", [id]);
  const collectionLinks = await query<{ productId: string; collectionId: string; id: string; name: string; slug: string }>(
    `SELECT pc.productId, pc.collectionId, c.id, c.name, c.slug
     FROM \`ProductCollection\` pc JOIN \`Collection\` c ON c.id = pc.collectionId
     WHERE pc.productId = ?`,
    [id]
  );
  const occasionLinks = await query<{ productId: string; occasionId: string; id: string; name: string; slug: string }>(
    `SELECT po.productId, po.occasionId, o.id, o.name, o.slug
     FROM \`ProductOccasion\` po JOIN \`Occasion\` o ON o.id = po.occasionId
     WHERE po.productId = ?`,
    [id]
  );

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
] as const;

export async function createProduct(input: ProductCreateInput) {
  const existingSku = await queryOne("SELECT id FROM `Product` WHERE sku = ? LIMIT 1", [input.sku]);
  if (existingSku) throw ApiError.conflict("A product with this SKU already exists");

  const existingSlug = await queryOne("SELECT id FROM `Product` WHERE slug = ? LIMIT 1", [input.slug]);
  if (existingSlug) throw ApiError.conflict("A product with this slug already exists");

  const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input as Record<string, unknown>;

  if ((variants as { sku: string }[] | undefined)?.length) {
    const skus = (variants as { sku: string }[]).map((v) => v.sku);
    const existingVariantSku = await queryOne<{ sku: string }>(
      `SELECT sku FROM \`ProductVariant\` WHERE sku IN (${skus.map(() => "?").join(",")}) LIMIT 1`,
      skus
    );
    if (existingVariantSku) throw ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
  }

  const productId = createId();

  await withTransaction(async (conn) => {
    const columns = PRODUCT_COLUMNS.filter((col) => productData[col] !== undefined);
    const values = columns.map((col) => productData[col] as string | number | boolean | null);

    await conn.query(
      `INSERT INTO \`Product\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
       VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`,
      [productId, ...values]
    );

    const categoryIdList = categoryIds as string[] | undefined;
    if (categoryIdList?.length) {
      for (const categoryId of categoryIdList) {
        await conn.query("INSERT INTO `ProductCategory` (productId, categoryId) VALUES (?, ?)", [productId, categoryId]);
      }
    }
    const collectionIdList = collectionIds as string[] | undefined;
    if (collectionIdList?.length) {
      for (const collectionId of collectionIdList) {
        await conn.query("INSERT INTO `ProductCollection` (productId, collectionId) VALUES (?, ?)", [productId, collectionId]);
      }
    }
    const occasionIdList = occasionIds as string[] | undefined;
    if (occasionIdList?.length) {
      for (const occasionId of occasionIdList) {
        await conn.query("INSERT INTO `ProductOccasion` (productId, occasionId) VALUES (?, ?)", [productId, occasionId]);
      }
    }

    const imageList = images as { url: string; altText?: string; isPrimary?: boolean }[] | undefined;
    if (imageList?.length) {
      for (let i = 0; i < imageList.length; i++) {
        const img = imageList[i];
        const thumbnailUrl = await generateThumbnail(img.url);
        await conn.query(
          "INSERT INTO `ProductImage` (id, productId, url, thumbnailUrl, altText, isPrimary, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))",
          [createId(), productId, img.url, thumbnailUrl, img.altText ?? null, img.isPrimary ?? i === 0, i]
        );
      }
    }

    const variantList = variants as Record<string, unknown>[] | undefined;
    if (variantList?.length) {
      for (const variant of variantList) {
        await conn.query(
          "INSERT INTO `ProductVariant` (id, productId, sku, color, size, priceDelta, stockQuantity, barcode, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))",
          [
            createId(),
            productId,
            variant.sku,
            variant.color ?? null,
            variant.size ?? null,
            variant.priceDelta ?? 0,
            variant.stockQuantity ?? 0,
            variant.barcode ?? null,
            variant.imageUrl ?? null,
          ]
        );
      }
    }
  });

  return getProductById(productId);
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  await getProductById(id);

  const { categoryIds, collectionIds, occasionIds, images, variants, ...productData } = input as Record<string, unknown>;

  if (input.sku) {
    const existing = await queryOne("SELECT id FROM `Product` WHERE sku = ? AND id != ? LIMIT 1", [input.sku, id]);
    if (existing) throw ApiError.conflict("A product with this SKU already exists");
  }

  if ((variants as { sku: string }[] | undefined)?.length) {
    const skus = (variants as { sku: string }[]).map((v) => v.sku);
    const existingVariantSku = await queryOne<{ sku: string }>(
      `SELECT sku FROM \`ProductVariant\` WHERE sku IN (${skus.map(() => "?").join(",")}) AND productId != ? LIMIT 1`,
      [...skus, id]
    );
    if (existingVariantSku) throw ApiError.conflict(`Variant SKU "${existingVariantSku.sku}" already exists`);
  }

  await withTransaction(async (conn) => {
    const columns = PRODUCT_COLUMNS.filter((col) => productData[col] !== undefined);
    if (columns.length) {
      const values = columns.map((col) => productData[col] as string | number | boolean | null);
      await conn.query(
        `UPDATE \`Product\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`,
        [...values, id]
      );
    }

    const categoryIdList = categoryIds as string[] | undefined;
    if (categoryIdList) {
      await conn.query("DELETE FROM `ProductCategory` WHERE productId = ?", [id]);
      for (const categoryId of categoryIdList) {
        await conn.query("INSERT INTO `ProductCategory` (productId, categoryId) VALUES (?, ?)", [id, categoryId]);
      }
    }
    const collectionIdList = collectionIds as string[] | undefined;
    if (collectionIdList) {
      await conn.query("DELETE FROM `ProductCollection` WHERE productId = ?", [id]);
      for (const collectionId of collectionIdList) {
        await conn.query("INSERT INTO `ProductCollection` (productId, collectionId) VALUES (?, ?)", [id, collectionId]);
      }
    }
    const occasionIdList = occasionIds as string[] | undefined;
    if (occasionIdList) {
      await conn.query("DELETE FROM `ProductOccasion` WHERE productId = ?", [id]);
      for (const occasionId of occasionIdList) {
        await conn.query("INSERT INTO `ProductOccasion` (productId, occasionId) VALUES (?, ?)", [id, occasionId]);
      }
    }

    const imageList = images as { url: string; altText?: string; isPrimary?: boolean }[] | undefined;
    if (imageList) {
      await conn.query("DELETE FROM `ProductImage` WHERE productId = ?", [id]);
      for (let i = 0; i < imageList.length; i++) {
        const img = imageList[i];
        const thumbnailUrl = await generateThumbnail(img.url);
        await conn.query(
          "INSERT INTO `ProductImage` (id, productId, url, thumbnailUrl, altText, isPrimary, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))",
          [createId(), id, img.url, thumbnailUrl, img.altText ?? null, img.isPrimary ?? i === 0, i]
        );
      }
    }

    const variantList = variants as Record<string, unknown>[] | undefined;
    if (variantList) {
      await conn.query("DELETE FROM `ProductVariant` WHERE productId = ?", [id]);
      for (const variant of variantList) {
        await conn.query(
          "INSERT INTO `ProductVariant` (id, productId, sku, color, size, priceDelta, stockQuantity, barcode, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))",
          [
            createId(),
            id,
            variant.sku,
            variant.color ?? null,
            variant.size ?? null,
            variant.priceDelta ?? 0,
            variant.stockQuantity ?? 0,
            variant.barcode ?? null,
            variant.imageUrl ?? null,
          ]
        );
      }
    }
  });

  return getProductById(id);
}

export async function softDeleteProduct(id: string) {
  await getProductById(id);
  await execute("UPDATE `Product` SET deletedAt = NOW(3), isActive = 0 WHERE id = ?", [id]);
}

export async function bulkDeleteProducts(ids: string[]) {
  if (!ids.length) return;
  await execute(
    `UPDATE \`Product\` SET deletedAt = NOW(3), isActive = 0 WHERE id IN (${ids.map(() => "?").join(",")})`,
    ids
  );
}
