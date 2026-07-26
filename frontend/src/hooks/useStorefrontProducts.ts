import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { ProductCard as ProductCardData } from "@/data/homeContent";

interface ApiProductImage {
  url: string;
}

interface ApiCategory {
  category: { id: string; name: string };
}

interface ApiVariant {
  id: string;
  size: string | null;
  color: string | null;
  priceDelta: string | number;
  stockQuantity: number;
  isActive: number | boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  fabric: string;
  color: string;
  shortDescription: string | null;
  description: string | null;
  washCare: string | null;
  sellingPrice: string | number;
  mrp: string | number;
  isNewArrival: number | boolean;
  isBestSeller: number | boolean;
  stockQuantity: number;
  avgRating: string | number;
  reviewCount: number;
  images: ApiProductImage[];
  categories: ApiCategory[];
  variants?: ApiVariant[];
}

interface ProductListResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function mapProduct(p: ApiProduct): ProductCardData {
  const category = p.categories[0]?.category?.name ?? p.fabric;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category,
    price: Number(p.sellingPrice),
    mrp: Number(p.mrp),
    image: p.images[0]?.url ?? "",
    fabric: p.fabric,
    isNew: Boolean(p.isNewArrival),
    isBestSeller: Boolean(p.isBestSeller),
    stockQuantity: p.stockQuantity,
  };
}

interface UseStorefrontProductsParams {
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isLiveSpecial?: boolean;
  isTopSelection?: boolean;
  categoryId?: string;
  search?: string;
  pageSize?: number;
}

export function useStorefrontProducts(params: UseStorefrontProductsParams = {}) {
  return useQuery({
    queryKey: ["storefront-products", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: ProductListResponse }>(
        "/storefront/products",
        { params: { pageSize: params.pageSize ?? 20, ...params } }
      );
      return data.data.items.map(mapProduct);
    },
  });
}

export function useStorefrontProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["storefront-product", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: ApiProduct }>(
        `/storefront/products/${slug}`
      );
      return mapProduct(data.data);
    },
    enabled: Boolean(slug),
  });
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  price: number;
  stockQuantity: number;
}

export interface ProductDetail extends ProductCardData {
  color: string;
  shortDescription: string | null;
  description: string | null;
  washCare: string | null;
  images: string[];
  categoryId?: string;
  avgRating: number;
  reviewCount: number;
  variants: ProductVariant[];
}

function mapProductDetail(p: ApiProduct): ProductDetail {
  const basePrice = Number(p.sellingPrice);
  const variants = (p.variants ?? [])
    .filter((v) => Boolean(v.isActive))
    .map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      price: basePrice + Number(v.priceDelta),
      stockQuantity: v.stockQuantity,
    }));

  return {
    ...mapProduct(p),
    color: p.color,
    shortDescription: p.shortDescription,
    description: p.description,
    washCare: p.washCare,
    images: p.images.map((img) => img.url),
    categoryId: p.categories[0]?.category?.id,
    avgRating: Number(p.avgRating),
    reviewCount: p.reviewCount,
    variants,
    sizes: variants.length ? variants.map((v) => v.size).filter((s): s is string => Boolean(s)) : undefined,
  };
}

export function useStorefrontProductDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["storefront-product-detail", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: ApiProduct }>(
        `/storefront/products/${slug}`
      );
      return mapProductDetail(data.data);
    },
    enabled: Boolean(slug),
  });
}
