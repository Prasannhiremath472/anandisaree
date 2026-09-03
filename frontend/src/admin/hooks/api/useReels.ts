import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface Reel {
  id: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  categoryId: string | null;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ReelFormValues {
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  categoryId?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive: boolean;
}

export function useReels(categoryId?: string) {
  return useQuery({
    queryKey: ["reels", categoryId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Reel[] }>("/admin/reels", { params: categoryId ? { categoryId } : {} });
      return res.data.data;
    },
  });
}

export function useCreateReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ReelFormValues) => {
      const res = await apiClient.post("/admin/reels", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reels"] }),
  });
}

export function useUpdateReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ReelFormValues> }) => {
      const res = await apiClient.put(`/admin/reels/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reels"] }),
  });
}

export function useDeleteReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/reels/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reels"] }),
  });
}
