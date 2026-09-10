"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReel = exports.updateReel = exports.createReel = exports.getReel = exports.listPublicReels = exports.listReels = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
const reel_schema_1 = require("../validation/reel.schema");
const REEL_COLUMNS = ["caption", "videoUrl", "thumbnailUrl", "categoryId", "linkUrl", "sortOrder", "isActive"];
exports.listReels = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
    const reels = categoryId
        ? await (0, db_1.query)("SELECT * FROM `Reel` WHERE deletedAt IS NULL AND categoryId = ? ORDER BY sortOrder ASC", [categoryId])
        : await (0, db_1.query)("SELECT * FROM `Reel` WHERE deletedAt IS NULL ORDER BY sortOrder ASC");
    res.json({ success: true, data: reels });
});
exports.listPublicReels = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const reels = await (0, db_1.query)("SELECT id, caption, videoUrl, thumbnailUrl, linkUrl FROM `Reel` WHERE deletedAt IS NULL AND isActive = 1 ORDER BY sortOrder ASC");
    res.json({ success: true, data: reels });
});
exports.getReel = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const reel = await (0, db_1.queryOne)("SELECT * FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
    if (!reel)
        throw ApiError_1.ApiError.notFound("Reel not found");
    res.json({ success: true, data: reel });
});
exports.createReel = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = reel_schema_1.reelCreateSchema.parse(req.body);
    const id = (0, id_1.createId)();
    const columns = REEL_COLUMNS.filter((col) => input[col] !== undefined);
    const values = columns.map((col) => input[col]);
    await (0, db_1.execute)(`INSERT INTO \`Reel\` (id, ${columns.map((c) => `\`${c}\``).join(", ")}, createdAt, updatedAt)
     VALUES (?, ${columns.map(() => "?").join(", ")}, NOW(3), NOW(3))`, [id, ...values]);
    const reel = await (0, db_1.queryOne)("SELECT * FROM `Reel` WHERE id = ? LIMIT 1", [id]);
    res.status(201).json({ success: true, data: reel });
});
exports.updateReel = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const input = reel_schema_1.reelUpdateSchema.parse(req.body);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Reel not found");
    const columns = REEL_COLUMNS.filter((col) => input[col] !== undefined);
    if (columns.length) {
        const values = columns.map((col) => input[col]);
        await (0, db_1.execute)(`UPDATE \`Reel\` SET ${columns.map((c) => `\`${c}\` = ?`).join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [
            ...values,
            req.params.id,
        ]);
    }
    const reel = await (0, db_1.queryOne)("SELECT * FROM `Reel` WHERE id = ? LIMIT 1", [req.params.id]);
    res.json({ success: true, data: reel });
});
exports.deleteReel = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Reel` WHERE id = ? AND deletedAt IS NULL LIMIT 1", [req.params.id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Reel not found");
    await (0, db_1.execute)("UPDATE `Reel` SET deletedAt = NOW(3) WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: null, message: "Reel deleted" });
});
//# sourceMappingURL=reel.controller.js.map