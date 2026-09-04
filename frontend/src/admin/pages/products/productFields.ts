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
  designPattern: "Design Pattern",
  craftOrigin: "Craft Origin",
  district: "District",
  blouseIncluded: "Blouse Included",
  blouseLength: "Blouse Length",
  weightGrams: "Weight",
  washCare: "Wash Care Instructions",
} as const;

export type ProductOptionalField = keyof typeof PRODUCT_OPTIONAL_FIELDS;

export const ALL_PRODUCT_OPTIONAL_FIELDS = Object.keys(PRODUCT_OPTIONAL_FIELDS) as ProductOptionalField[];
