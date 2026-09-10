"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
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
async function listCategories() {
    return (0, db_1.query)(`SELECT c.*, (
       SELECT COUNT(*) FROM \`ProductCategory\` pc
       JOIN \`Product\` p ON p.id = pc.productId
       WHERE pc.categoryId = c.id AND p.deletedAt IS NULL
     ) as productCount
     FROM \`Category\` c
     WHERE c.deletedAt IS NULL
     ORDER BY c.\`group\` ASC, c.sortOrder ASC, c.name ASC`);
}
async function createCategory(input) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Category` WHERE slug = ?", [slug]);
    if (existing)
        throw ApiError_1.ApiError.conflict("A category with this name/slug already exists");
    const id = (0, id_1.createId)();
    await (0, db_1.execute)(`INSERT INTO \`Category\`
      (id, name, slug, description, \`group\`, imageUrl, parentId, isActive, sortOrder, metaTitle, metaDescription, enabledFields, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`, [
        id,
        input.name,
        slug,
        input.description ?? null,
        input.group ?? "PAN_INDIAN",
        input.imageUrl ?? null,
        input.parentId ?? null,
        input.isActive ?? true,
        input.sortOrder ?? 0,
        input.metaTitle ?? null,
        input.metaDescription ?? null,
        input.enabledFields ? JSON.stringify(input.enabledFields) : null,
    ]);
    return (0, db_1.queryOne)("SELECT * FROM `Category` WHERE id = ?", [id]);
}
async function updateCategory(id, input) {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Category` WHERE id = ? AND deletedAt IS NULL", [id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Category not found");
    if (input.slug || input.name) {
        const slug = input.slug ? slugify(input.slug) : slugify(input.name);
        const slugConflict = await (0, db_1.queryOne)("SELECT id FROM `Category` WHERE slug = ? AND id != ?", [slug, id]);
        if (slugConflict)
            throw ApiError_1.ApiError.conflict("A category with this name/slug already exists");
        input = { ...input, slug };
    }
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(input)) {
        if (value === undefined)
            continue;
        fields.push(`\`${key}\` = ?`);
        values.push(key === "enabledFields" ? (value ? JSON.stringify(value) : null) : value);
    }
    if (fields.length === 0) {
        return (0, db_1.queryOne)("SELECT * FROM `Category` WHERE id = ?", [id]);
    }
    await (0, db_1.execute)(`UPDATE \`Category\` SET ${fields.join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [...values, id]);
    return (0, db_1.queryOne)("SELECT * FROM `Category` WHERE id = ?", [id]);
}
async function deleteCategory(id) {
    const existing = await (0, db_1.queryOne)("SELECT id FROM `Category` WHERE id = ? AND deletedAt IS NULL", [id]);
    if (!existing)
        throw ApiError_1.ApiError.notFound("Category not found");
    await (0, db_1.execute)("UPDATE `Category` SET deletedAt = NOW(3) WHERE id = ?", [id]);
}
//# sourceMappingURL=category.service.js.map