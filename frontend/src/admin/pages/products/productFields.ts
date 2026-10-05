// Optional Product fields that don't apply to every category (e.g. Saree
// Length doesn't make sense for Nightwear). Required fields — Title, Fabric,
// Color, MRP, Selling Price, SKU, Slug — are never in this list; they always
// show regardless of category.
//
// Shared between the category editor (which fields a category enables by
// default) and the product form (which fields to show/hide for the selected
// category, with a manual per-product override on top).
export const PRODUCT_OPTIONAL_FIELDS = {
  sareeLength: "Saree Length",
  weavingTechnique: "Weaving Technique",
  borderType: "Border Type",
  palluDesign: "Pallu Design",
  blouseDetails: "Blouse Details",
  washCare: "Wash Care Instructions",
} as const;

export type ProductOptionalField = keyof typeof PRODUCT_OPTIONAL_FIELDS;

export const ALL_PRODUCT_OPTIONAL_FIELDS = Object.keys(PRODUCT_OPTIONAL_FIELDS) as ProductOptionalField[];

// Standard apparel size scale offered as quick-pick suggestions wherever a
// size is chosen (the variant Size option, and the standalone Available
// Sizes field) — admins can still type/add a custom size (e.g. "Free Size").
export const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];
