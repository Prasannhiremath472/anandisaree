import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";
import type { CategoryLookup, Product, ProductFormValues, ProductStatus } from "@/admin/types/product";

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
  status?: ProductStatus;
  fabric?: string;
  lowStockOnly?: boolean;
  categoryId?: string;
}

export function useProducts(params: ListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<Product> }>("/admin/products", { params });
      return res.data.data;
    },
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product }>(`/admin/products/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export function useCategoriesLookup() {
  return useQuery({
    queryKey: ["categories-lookup"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CategoryLookup[] }>("/admin/products/lookups/categories");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<ProductFormValues>) => {
      const res = await apiClient.post("/admin/products", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ProductFormValues> }) => {
      const res = await apiClient.put(`/admin/products/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useGenerateDescription() {
  return useMutation({
    mutationFn: async (input: { name: string; fabric: string; color: string; category?: string; shortDescription?: string }) => {
      const res = await apiClient.post<{ data: { description: string } }>("/admin/products/generate-description", input);
      return res.data.data.description;
    },
  });
}

export interface ImportRowResult {
  row: number;
  sku: string;
  name: string;
  status: "created" | "skipped" | "failed";
  message?: string;
}

export interface ImportProductsResult {
  created: number;
  skipped: number;
  failed: number;
  results: ImportRowResult[];
}

export function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post<{ data: ImportProductsResult }>("/admin/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProductStatus }) => {
      const res = await apiClient.patch(`/admin/products/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

interface TrashListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export function useTrashedProducts(params: TrashListParams) {
  return useQuery({
    queryKey: ["products-trash", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<Product> }>("/admin/products/trash", { params });
      return res.data.data;
    },
  });
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post(`/admin/products/${id}/restore`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-trash"] });
    },
  });
}

export function usePermanentlyDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/products/${id}/permanent`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products-trash"] }),
  });
}

export function useVariantValues(optionName: "Color" | "Size" | undefined) {
  return useQuery({
    queryKey: ["variant-values", optionName],
    queryFn: async () => {
      const res = await apiClient.get<{ data: string[] }>("/admin/products/variant-values", {
        params: { optionName },
      });
      return res.data.data;
    },
    enabled: Boolean(optionName),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNextSku(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["next-sku", categoryId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { sku: string } }>("/admin/products/next-sku", {
        params: { categoryId },
      });
      return res.data.data.sku;
    },
    enabled: Boolean(categoryId),
  });
}
