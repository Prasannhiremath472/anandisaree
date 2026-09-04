import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  group: "MAHARASHTRIAN" | "PAN_INDIAN";
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  /** Which optional product fields apply to this category. Null/empty = show all fields (no restriction set). */
  enabledFields: string[] | null;
}

export interface CategoryFormInput {
  name: string;
  slug?: string;
  description?: string;
  group?: "MAHARASHTRIAN" | "PAN_INDIAN";
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
  enabledFields?: string[] | null;
}

export function useCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Category[] }>("/admin/categories");
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CategoryFormInput) => {
      const res = await apiClient.post<{ data: Category }>("/admin/categories", input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-lookup"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CategoryFormInput }) => {
      const res = await apiClient.put<{ data: Category }>(`/admin/categories/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-lookup"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-lookup"] });
    },
  });
}
