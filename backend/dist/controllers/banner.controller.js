"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBanner = exports.listBanners = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = require("../config/prisma");
const ApiError_1 = require("../utils/ApiError");
const banner_schema_1 = require("../validation/banner.schema");
exports.listBanners = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const placement = req.query.placement;
    const banners = await prisma_1.prisma.banner.findMany({
        where: placement ? { placement: placement } : undefined,
        orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
    });
    res.json({ success: true, data: banners });
});
exports.getBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await prisma_1.prisma.banner.findUnique({ where: { id: req.params.id } });
    if (!banner)
        throw ApiError_1.ApiError.notFound("Banner not found");
    res.json({ success: true, data: banner });
});
exports.createBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = banner_schema_1.bannerCreateSchema.parse(req.body);
    const banner = await prisma_1.prisma.banner.create({ data: input });
    res.status(201).json({ success: true, data: banner });
});
exports.updateBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = banner_schema_1.bannerUpdateSchema.parse(req.body);
    const existing = await prisma_1.prisma.banner.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Banner not found");
    const banner = await prisma_1.prisma.banner.update({ where: { id: req.params.id }, data: input });
    res.json({ success: true, data: banner });
});
exports.deleteBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await prisma_1.prisma.banner.findUnique({ where: { id: req.params.id } });
    if (!existing)
        throw ApiError_1.ApiError.notFound("Banner not found");
    await prisma_1.prisma.banner.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null, message: "Banner deleted" });
});
//# sourceMappingURL=banner.controller.js.map