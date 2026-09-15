"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductTag = exports.listProductTags = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const db_1 = require("../config/db");
const id_1 = require("../utils/id");
const ApiError_1 = require("../utils/ApiError");
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
exports.listProductTags = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const tags = await (0, db_1.query)("SELECT * FROM `ProductTag` ORDER BY name ASC");
    res.json({ success: true, data: tags });
});
const createTagSchema = zod_1.z.object({ name: zod_1.z.string().min(1).max(50) });
exports.createProductTag = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name } = createTagSchema.parse(req.body);
    const slug = slugify(name);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `ProductTag` WHERE name = ? OR slug = ? LIMIT 1", [
        name,
        slug,
    ]);
    if (existing)
        throw ApiError_1.ApiError.conflict("This tag already exists");
    const id = (0, id_1.createId)();
    await (0, db_1.execute)("INSERT INTO `ProductTag` (id, name, slug, createdAt) VALUES (?, ?, ?, NOW(3))", [id, name, slug]);
    const tag = await (0, db_1.queryOne)("SELECT * FROM `ProductTag` WHERE id = ? LIMIT 1", [id]);
    res.status(201).json({ success: true, data: tag });
});
//# sourceMappingURL=productTag.controller.js.map