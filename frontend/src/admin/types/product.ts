export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductCategoryRef {
  category: { id: string; name: string; slug: string; group: string; parentId: string | null };
}

export interface ProductTagRef {
  tag: { id: string; name: string; slug: string };
}

export interface ProductCustomField {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  priceDelta: string;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string | null;
}

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

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
  sareeLength?: string | null;
  craftOrigin?: string | null;
  district?: string | null;
  blouseLength?: string | null;
  blouseDetails?: string | null;
  weightGrams?: number | null;
  washCare?: string | null;
  blouseIncluded: boolean;
  mrp: string;
  sellingPrice: string;
  gstPercent: string;
  specialOfferPercent?: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTodaysDeal: boolean;
  isLiveSpecial: boolean;
  isTopSelection: boolean;
  avgRating: string;
  reviewCount: number;
  createdAt: string;
  images: ProductImage[];
  categories: ProductCategoryRef[];
  variants: ProductVariant[];
  tags?: ProductTagRef[];
  customFields?: ProductCustomField[];
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
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  blouseIncluded: boolean;
  isHandloom: boolean;
  isLiveSpecial: boolean;
  categoryIds: string[];
  images: { url: string }[];
}
