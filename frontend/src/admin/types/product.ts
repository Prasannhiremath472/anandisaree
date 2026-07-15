export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductCategoryRef {
  category: { id: string; name: string; slug: string; group: string };
}

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  priceDelta: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  fabric: string;
  weavingTechnique?: string | null;
  isHandloom: boolean;
  borderType?: string | null;
  palluDesign?: string | null;
  designPattern?: string | null;
  color: string;
  sareeLength: string;
  blouseIncluded: boolean;
  mrp: string;
  sellingPrice: string;
  gstPercent: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTodaysDeal: boolean;
  avgRating: string;
  reviewCount: number;
  createdAt: string;
  images: ProductImage[];
  categories: ProductCategoryRef[];
}

export interface CategoryLookup {
  id: string;
  name: string;
  slug: string;
  group: "MAHARASHTRIAN" | "PAN_INDIAN";
  parentId: string | null;
}

export interface ProductFormValues {
  sku: string;
  name: string;
  slug: string;
  fabric: string;
  color: string;
  sareeLength: number;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  blouseIncluded: boolean;
  isHandloom: boolean;
  categoryIds: string[];
  images: { url: string }[];
}
