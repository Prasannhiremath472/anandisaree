import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as categoryService from "../services/category.service";
import { categoryCreateSchema, categoryUpdateSchema } from "../validation/category.schema";

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = categoryCreateSchema.parse(req.body);
  const category = await categoryService.createCategory(input);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = categoryUpdateSchema.parse(req.body);
  const category = await categoryService.updateCategory(req.params.id, input);
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ success: true, data: null, message: "Category deleted" });
});
