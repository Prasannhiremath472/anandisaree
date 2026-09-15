import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";
import * as productService from "../services/product.service";
import {
  productCreateSchema,
  productListQuerySchema,
  productStatusUpdateSchema,
  productUpdateSchema,
} from "../validation/product.schema";
import { z } from "zod";
import { query } from "../config/db";
import { generateProductDescription } from "../services/gemini.service";
import { importProductsFromExcel } from "../services/productImport.service";
import { toCsv, sendCsv } from "../utils/csv";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = productListQuerySchema.parse(req.query);
  const pagination = getPagination(req);
  const result = await productService.listProducts(pagination, query);
  res.json({ success: true, data: result });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, data: product });
});

const publicProductListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sortBy: z.enum(["createdAt", "sellingPrice", "name", "stockQuantity"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  isNewArrival: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isLiveSpecial: z.coerce.boolean().optional(),
  isTopSelection: z.coerce.boolean().optional(),
});

export const listPublicProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = publicProductListQuerySchema.parse(req.query);
  const pagination = getPagination(req);
  const result = await productService.listPublicProducts(pagination, query);
  res.json({ success: true, data: result });
});

export const getPublicProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = productCreateSchema.parse(req.body);
  const product = await productService.createProduct(input);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const input = productUpdateSchema.parse(req.body);
  const product = await productService.updateProduct(req.params.id, input);
  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.softDeleteProduct(req.params.id);
  res.json({ success: true, data: null, message: "Product deleted" });
});

export const updateProductStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = productStatusUpdateSchema.parse(req.body);
  const product = await productService.updateProductStatus(req.params.id, status);
  res.json({ success: true, data: product });
});

export const listTrashedProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = z.object({ search: z.string().optional() }).parse(req.query);
  const pagination = getPagination(req);
  const result = await productService.listTrashedProducts(pagination, query);
  res.json({ success: true, data: result });
});

export const restoreProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.restoreProduct(req.params.id);
  res.json({ success: true, data: product });
});

export const permanentlyDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.permanentlyDeleteProduct(req.params.id);
  res.json({ success: true, data: null, message: "Product permanently deleted" });
});

export const getNextSku = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = z.object({ categoryId: z.string().min(1) }).parse(req.query);
  const sku = await productService.generateNextSku(categoryId);
  res.json({ success: true, data: { sku } });
});

const variantValuesQuerySchema = z.object({ optionName: z.enum(["Color", "Size"]) });

export const listVariantValues = asyncHandler(async (req: Request, res: Response) => {
  const { optionName } = variantValuesQuerySchema.parse(req.query);
  const column = optionName === "Color" ? "color" : "size";
  const values = await query<{ value: string }>(
    `SELECT DISTINCT \`${column}\` as value FROM \`ProductVariant\` WHERE \`${column}\` IS NOT NULL AND \`${column}\` != '' ORDER BY \`${column}\` ASC`
  );
  res.json({ success: true, data: values.map((v) => v.value) });
});

const generateDescriptionSchema = z.object({
  name: z.string().min(1),
  fabric: z.string().min(1),
  color: z.string().min(1),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
});

export const generateDescription = asyncHandler(async (req: Request, res: Response) => {
  const input = generateDescriptionSchema.parse(req.body);
  const description = await generateProductDescription(input);
  res.json({ success: true, data: { description } });
});

const bulkDeleteSchema = z.object({ ids: z.array(z.string()).min(1) });

export const bulkDeleteProducts = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = bulkDeleteSchema.parse(req.body);
  await productService.bulkDeleteProducts(ids);
  res.json({ success: true, data: null, message: `${ids.length} products deleted` });
});

export const listCategoriesLookup = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await query(
    "SELECT id, name, slug, `group`, parentId FROM `Category` WHERE deletedAt IS NULL ORDER BY `group` ASC, sortOrder ASC"
  );
  res.json({ success: true, data: categories });
});

export const listPublicCategoriesLookup = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await query(
    "SELECT id, name, slug, `group`, parentId FROM `Category` WHERE deletedAt IS NULL AND isActive = 1 ORDER BY `group` ASC, sortOrder ASC"
  );
  res.json({ success: true, data: categories });
});

export const listBrandsLookup = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await query("SELECT id, name FROM `Brand` WHERE isActive = 1");
  res.json({ success: true, data: brands });
});

export const exportProducts = asyncHandler(async (req: Request, res: Response) => {
  const filters = productListQuerySchema.parse(req.query);
  const products = await productService.listAllProductsForExport(filters);

  const headers = ["SKU", "Name", "Fabric", "Color", "Category", "MRP", "Selling Price", "Stock", "Status", "Created At"];
  const rows = products.map((p) => [
    p.sku,
    p.name,
    p.fabric,
    p.color,
    p.categoryNames,
    p.mrp,
    p.sellingPrice,
    p.stockQuantity,
    p.status,
    new Date(p.createdAt as string).toISOString(),
  ]);

  sendCsv(res, "products.csv", toCsv(headers, rows));
});

export const importProducts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No Excel file provided" });
  }
  const result = await importProductsFromExcel(req.file.buffer);
  res.json({ success: true, data: result });
});
