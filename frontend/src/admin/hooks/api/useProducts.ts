import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";
import type { CategoryLookup, Product, ProductFormValues } from "@/admin/types/product";

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
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

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
