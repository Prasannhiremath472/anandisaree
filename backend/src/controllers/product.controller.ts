import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getPagination } from "../utils/pagination";
import * as productService from "../services/product.service";
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from "../validation/product.schema";
import { z } from "zod";
import { query } from "../config/db";

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

export const listBrandsLookup = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await query("SELECT id, name FROM `Brand` WHERE isActive = 1");
  res.json({ success: true, data: brands });
});
