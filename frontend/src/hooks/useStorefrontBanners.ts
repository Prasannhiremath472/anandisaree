import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export type BannerPlacement = "HOMEPAGE_SLIDER" | "FESTIVAL_BANNER" | "OFFER_BANNER" | "COLLECTION_BANNER" | "POPUP_BANNER";

export interface StorefrontBanner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaLabel: string | null;
  placement: BannerPlacement;
  sortOrder: number;
}

export function useStorefrontBanners(placement?: BannerPlacement) {
  return useQuery({
    queryKey: ["storefront-banners", placement],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: StorefrontBanner[] }>("/storefront/banners", {
        params: placement ? { placement } : {},
      });
      return data.data;
    },
  });
}
