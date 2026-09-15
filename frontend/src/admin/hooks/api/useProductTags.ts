import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
}

export function useProductTags() {
  return useQuery({
    queryKey: ["product-tags"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ProductTag[] }>("/admin/product-tags");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProductTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post<{ data: ProductTag }>("/admin/product-tags", { name });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["product-tags"] }),
  });
}
