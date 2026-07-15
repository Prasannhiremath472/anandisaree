"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerUpdateSchema = exports.bannerCreateSchema = void 0;
const zod_1 = require("zod");
exports.bannerCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().min(1),
    linkUrl: zod_1.z.string().optional(),
    placement: zod_1.z.enum(["HOMEPAGE_SLIDER", "FESTIVAL_BANNER", "OFFER_BANNER", "COLLECTION_BANNER", "POPUP_BANNER"]),
    sortOrder: zod_1.z.coerce.number().int().optional(),
    isActive: zod_1.z.boolean().optional(),
    startsAt: zod_1.z.coerce.date().optional(),
    endsAt: zod_1.z.coerce.date().optional(),
});
exports.bannerUpdateSchema = exports.bannerCreateSchema.partial();
//# sourceMappingURL=banner.schema.js.map