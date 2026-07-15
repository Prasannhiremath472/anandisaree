import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export type BannerPlacement = "HOMEPAGE_SLIDER" | "FESTIVAL_BANNER" | "OFFER_BANNER" | "COLLECTION_BANNER" | "POPUP_BANNER";

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  sortOrder: number;
  isActive: boolean;
}

export interface BannerFormValues {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  placement: BannerPlacement;
  sortOrder?: number;
  isActive: boolean;
}

export function useBanners(placement?: string) {
  return useQuery({
    queryKey: ["banners", placement],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Banner[] }>("/admin/banners", { params: placement ? { placement } : {} });
      return res.data.data;
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BannerFormValues) => {
      const res = await apiClient.post("/admin/banners", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BannerFormValues> }) => {
      const res = await apiClient.put(`/admin/banners/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/banners/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });
}
