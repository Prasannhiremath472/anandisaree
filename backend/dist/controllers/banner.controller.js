"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBanner = exports.listBanners = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const banner_schema_1 = require("../validation/banner.schema");
const BANNER_COLUMNS = ["title", "imageUrl", "linkUrl", "placement", "sortOrder", "isActive", "startsAt", "endsAt"];
exports.listBanners = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const placement = req.query.placement;
    const banners = placement
        ? await (0, db_1.query)("SELECT * FROM `Banner` WHERE placement = ? ORDER BY placement ASC, sortOrder ASC", [placement])
        : await (0, db_1.query)("SELECT * FROM `Banner` ORDER BY placement ASC, sortOrder ASC");
    res.json({ success: true, data: banners });
});
exports.getBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const banner = await (0, db_1.queryOne)("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!banner)
        throw ApiError_1.ApiError.notFound("Banner not found");
    res.json({ success: true, data: banner });
});
exports.createBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = banner_schema_1.bannerCreateSchema.parse(req.body);
    const id = (0, id_1.createId)();
    const columns = BANNER_COLUMNS.filter((col) => input[col] !== undefined);
    const values = columns.map((col) => input[col]);
    await (0, db_1.execute)(`INSERT INTO \`Banner\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3))`, [id, ...values]);
    const banner = await (0, db_1.queryOne)("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [id]);
    res.status(201).json({ success: true, data: banner });
});
exports.updateBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = banner_schema_1.bannerUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Banner not found");
    const columns = BANNER_COLUMNS.filter((col) => input[col] !== undefined);
    if (columns.length) {
        const values = columns.map((col) => input[col]);
        await (0, db_1.execute)(`UPDATE \`Banner\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")} WHERE id = ?`, [
            ...values,
            req.params.id,
        ]);
    }
    const banner = await (0, db_1.queryOne)("SELECT * FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: banner });
});
exports.deleteBanner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Banner` WHERE id = ? LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Banner not found");
    await (0, db_1.execute)("DELETE FROM `Banner` WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: null, message: "Banner deleted" });
});
//# sourceMappingURL=banner.controller.js.map