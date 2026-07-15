import { z } from "zod";

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "sellingPrice", "name", "stockQuantity"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const productCreateSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  brandId: z.string().optional(),
  fabric: z.string().min(1),
  weavingTechnique: z.string().optional(),
  isHandloom: z.boolean().optional(),
  borderType: z.string().optional(),
  palluDesign: z.string().optional(),
  designPattern: z.string().optional(),
  color: z.string().min(1),
  secondaryColors: z.string().optional(),
  sareeLength: z.coerce.number().positive(),
  blouseIncluded: z.boolean().optional(),
  blouseLength: z.coerce.number().positive().optional(),
  weightGrams: z.coerce.number().int().positive().optional(),
  craftOrigin: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  weaverDetails: z.string().optional(),
  mrp: z.coerce.number().positive(),
  sellingPrice: z.coerce.number().positive(),
  gstPercent: z.coerce.number().min(0).max(100).optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  dispatchDays: z.coerce.number().int().min(0).optional(),
  deliveryEstimateDays: z.coerce.number().int().min(0).optional(),
  washCare: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isTodaysDeal: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  occasionIds: z.array(z.string()).optional(),
  images: z.array(z.object({ url: z.string(), altText: z.string().optional(), isPrimary: z.boolean().optional() })).optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1),
        color: z.string().optional(),
        size: z.string().optional(),
        priceDelta: z.coerce.number().optional(),
        stockQuantity: z.coerce.number().int().min(0).optional(),
        barcode: z.string().optional(),
        imageUrl: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
