import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { ProductCard as ProductCardData } from "@/data/homeContent";

interface ApiProductImage {
  url: string;
}

interface ApiCategory {
  category: { name: string };
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  fabric: string;
  sellingPrice: string | number;
  mrp: string | number;
  isNewArrival: number | boolean;
  isBestSeller: number | boolean;
  images: ApiProductImage[];
  categories: ApiCategory[];
}

interface ProductListResponse {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function mapProduct(p: ApiProduct): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    category: p.categories[0]?.category?.name ?? p.fabric,
    price: Number(p.sellingPrice),
    mrp: Number(p.mrp),
    image: p.images[0]?.url ?? "",
    fabric: p.fabric,
    isNew: Boolean(p.isNewArrival),
    isBestSeller: Boolean(p.isBestSeller),
  };
}

interface UseStorefrontProductsParams {
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
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
