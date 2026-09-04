import { query, queryOne, execute } from "../config/db";
import { createId } from "../utils/id";
import { ApiError } from "../utils/ApiError";
import type { CategoryCreateInput, CategoryUpdateInput } from "../validation/category.schema";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listCategories() {
  return query<Record<string, unknown>>(
    `SELECT c.*, (
       SELECT COUNT(*) FROM \`ProductCategory\` pc
       JOIN \`Product\` p ON p.id = pc.productId
       WHERE pc.categoryId = c.id AND p.deletedAt IS NULL
     ) as productCount
     FROM \`Category\` c
     WHERE c.deletedAt IS NULL
     ORDER BY c.\`group\` ASC, c.sortOrder ASC, c.name ASC`
  );
}

export async function createCategory(input: CategoryCreateInput) {
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);

  const existing = await queryOne("SELECT id FROM `Category` WHERE slug = ?", [slug]);
  if (existing) throw ApiError.conflict("A category with this name/slug already exists");

  const id = createId();
  await execute(
    `INSERT INTO \`Category\`
      (id, name, slug, description, \`group\`, imageUrl, parentId, isActive, sortOrder, metaTitle, metaDescription, enabledFields, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
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
    ]
  );

  return queryOne("SELECT * FROM `Category` WHERE id = ?", [id]);
}

export async function updateCategory(id: string, input: CategoryUpdateInput) {
  const existing = await queryOne("SELECT id FROM `Category` WHERE id = ? AND deletedAt IS NULL", [id]);
  if (!existing) throw ApiError.notFound("Category not found");

  if (input.slug || input.name) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name!);
    const slugConflict = await queryOne("SELECT id FROM `Category` WHERE slug = ? AND id != ?", [slug, id]);
    if (slugConflict) throw ApiError.conflict("A category with this name/slug already exists");
    input = { ...input, slug };
  }

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    fields.push(`\`${key}\` = ?`);
    values.push(key === "enabledFields" ? (value ? JSON.stringify(value) : null) : (value as string | number | boolean | null));
  }

  if (fields.length === 0) {
    return queryOne("SELECT * FROM `Category` WHERE id = ?", [id]);
  }

  await execute(`UPDATE \`Category\` SET ${fields.join(", ")}, updatedAt = NOW(3) WHERE id = ?`, [...values, id]);

  return queryOne("SELECT * FROM `Category` WHERE id = ?", [id]);
}

export async function deleteCategory(id: string) {
  const existing = await queryOne("SELECT id FROM `Category` WHERE id = ? AND deletedAt IS NULL", [id]);
  if (!existing) throw ApiError.notFound("Category not found");

  await execute("UPDATE `Category` SET deletedAt = NOW(3) WHERE id = ?", [id]);
}
