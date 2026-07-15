import { z } from "zod";

export const bannerCreateSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  linkUrl: z.string().optional(),
  placement: z.enum(["HOMEPAGE_SLIDER", "FESTIVAL_BANNER", "OFFER_BANNER", "COLLECTION_BANNER", "POPUP_BANNER"]),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export const bannerUpdateSchema = bannerCreateSchema.partial();

export type BannerCreateInput = z.infer<typeof bannerCreateSchema>;
export type BannerUpdateInput = z.infer<typeof bannerUpdateSchema>;
