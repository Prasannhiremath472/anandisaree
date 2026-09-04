import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X, Minus, Plus } from "lucide-react";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Card } from "@/admin/components/ui/Card";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useCreateProduct, useGenerateDescription, useProduct, useUpdateProduct } from "@/admin/hooks/api/useProducts";
import { useCategories } from "@/admin/hooks/api/useCategories";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";
import { useAppSelector } from "@/admin/hooks/redux";
import { VariantsCard, type VariantOption, type VariantRow } from "./VariantsCard";
import { FABRIC_OPTIONS, WASH_CARE_BY_FABRIC } from "./fabricOptions";
import { PRODUCT_OPTIONAL_FIELDS, ALL_PRODUCT_OPTIONAL_FIELDS, type ProductOptionalField } from "./productFields";

type RemovableField = ProductOptionalField;
const REMOVABLE_FIELDS = PRODUCT_OPTIONAL_FIELDS;

function RemoveFieldButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove this field"
      className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-600"
    >
      <Minus className="h-3 w-3" /> Not needed
    </button>
  );
}

const emptyForm = {
  // Core
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  images: [] as string[],
  categoryId: "",

  // Pricing & inventory
  mrp: "",
  sellingPrice: "",
  gstPercent: "5",
  stockQuantity: "0",
  lowStockThreshold: "5",

  // Craft details
  fabric: "",
  color: "",
  sareeLength: "5.5",
  weavingTechnique: "",
  borderType: "",
  palluDesign: "",
  designPattern: "",
  craftOrigin: "",
  district: "",
  blouseLength: "0.8",
  weightGrams: "",
  washCare: "",

  // Flags
  isActive: true,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isTodaysDeal: false,
  isLiveSpecial: false,
  isTopSelection: false,
  blouseIncluded: true,
  isHandloom: false,

  // SEO
  metaTitle: "",
  metaDescription: "",
};

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const { data: existing, isLoading } = useProduct(id ?? null);
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useImageUpload();
  const generateDescriptionMutation = useGenerateDescription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    // Pre-fill from whichever category tab was active when "Add Product" was
    // clicked (or a ?categoryId= override), so a brand-new product starts
    // scoped to that category's field set instead of showing everything.
    categoryId: isEdit ? "" : searchParams.get("categoryId") || selectedCategoryId || "",
  }));
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [isCustomFabric, setIsCustomFabric] = useState(false);
  const [removedFields, setRemovedFields] = useState<Set<RemovableField>>(new Set());
  const [manuallyRestored, setManuallyRestored] = useState<Set<RemovableField>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<RemovableField>>(new Set());

  function removeField(field: RemovableField) {
    setRemovedFields((prev) => new Set(prev).add(field));
    setManuallyRemoved((prev) => new Set(prev).add(field));
    setManuallyRestored((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }

  function restoreField(field: RemovableField) {
    setRemovedFields((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    setManuallyRestored((prev) => new Set(prev).add(field));
    setManuallyRemoved((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }

  // Recompute the default visible-field set whenever the selected category
  // changes, based on that category's enabledFields — but keep any field the
  // admin has manually removed/restored on this product so switching the
  // category dropdown back and forth doesn't discard a deliberate override.
  useEffect(() => {
    if (isEdit) return; // existing products load their own removed-field state from saved data instead
    const category = categories?.find((c) => c.id === form.categoryId);
    const enabled = category?.enabledFields?.length ? category.enabledFields : ALL_PRODUCT_OPTIONAL_FIELDS;
    const nextRemoved = new Set<RemovableField>(
      ALL_PRODUCT_OPTIONAL_FIELDS.filter((f) => !enabled.includes(f) && !manuallyRestored.has(f))
    );
    for (const f of manuallyRemoved) nextRemoved.add(f);
    setRemovedFields(nextRemoved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.categoryId, categories, isEdit]);

  async function handleGenerateDescription() {
    if (!form.name || !form.fabric || !form.color) {
      toast.error("Add a title, fabric and color first");
      return;
    }
    try {
      const categoryName = categories?.find((c) => c.id === form.categoryId)?.name;
      const description = await generateDescriptionMutation.mutateAsync({
        name: form.name,
        fabric: form.fabric,
        color: form.color,
        category: categoryName,
        shortDescription: form.shortDescription || undefined,
      });
      setForm((f) => ({ ...f, description }));
      toast.success("Description generated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not generate description");
    }
  }

  function handleFabricSelect(value: string) {
    if (value === "__custom__") {
      setIsCustomFabric(true);
      setForm((f) => ({ ...f, fabric: "" }));
      return;
    }
    setIsCustomFabric(false);
    setForm((f) => ({
      ...f,
      fabric: value,
      washCare: f.washCare ? f.washCare : WASH_CARE_BY_FABRIC[value] ?? f.washCare,
    }));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    for (const file of files) {
      try {
        const { dataUri } = await uploadMutation.mutateAsync(file);
        setForm((f) => ({ ...f, images: [...f.images, dataUri] }));
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? `Failed to upload ${file.name}`);
      }
    }
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  function makeImagePrimary(index: number) {
    setForm((f) => {
      const images = [...f.images];
      const [selected] = images.splice(index, 1);
      images.unshift(selected);
      return { ...f, images };
    });
  }

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        slug: existing.slug,
        sku: existing.sku,
        shortDescription: existing.shortDescription ?? "",
        description: existing.description ?? "",
        images: existing.images.map((img) => img.url),
        categoryId: existing.categories[0]?.category.id ?? "",
        mrp: existing.mrp,
        sellingPrice: existing.sellingPrice,
        gstPercent: existing.gstPercent,
        stockQuantity: String(existing.stockQuantity),
        lowStockThreshold: String(existing.lowStockThreshold),
        fabric: existing.fabric,
        color: existing.color,
        sareeLength: existing.sareeLength ?? "",
        weavingTechnique: existing.weavingTechnique ?? "",
        borderType: existing.borderType ?? "",
        palluDesign: existing.palluDesign ?? "",
        designPattern: existing.designPattern ?? "",
        craftOrigin: existing.craftOrigin ?? "",
        district: existing.district ?? "",
        blouseLength: existing.blouseLength ?? "",
        weightGrams: existing.weightGrams ? String(existing.weightGrams) : "",
        washCare: existing.washCare ?? "",
        isActive: existing.isActive,
        isFeatured: existing.isFeatured,
        isNewArrival: existing.isNewArrival,
        isBestSeller: existing.isBestSeller,
        isTodaysDeal: existing.isTodaysDeal,
        isLiveSpecial: existing.isLiveSpecial ?? false,
        isTopSelection: existing.isTopSelection ?? false,
        blouseIncluded: existing.blouseIncluded,
        isHandloom: existing.isHandloom,
        metaTitle: "",
        metaDescription: "",
      });

      // Fields that were never set on this product start out removed from
      // view, rather than showing a wall of blank optional inputs.
      const emptyOnLoad: RemovableField[] = [];
      if (!existing.sareeLength) emptyOnLoad.push("sareeLength");
      if (!existing.weavingTechnique) emptyOnLoad.push("weavingTechnique");
      if (!existing.borderType) emptyOnLoad.push("borderType");
      if (!existing.palluDesign) emptyOnLoad.push("palluDesign");
      if (!existing.designPattern) emptyOnLoad.push("designPattern");
      if (!existing.craftOrigin) emptyOnLoad.push("craftOrigin");
      if (!existing.district) emptyOnLoad.push("district");
      if (!existing.blouseLength) emptyOnLoad.push("blouseLength");
      if (!existing.weightGrams) emptyOnLoad.push("weightGrams");
      if (!existing.washCare) emptyOnLoad.push("washCare");
      setRemovedFields(new Set(emptyOnLoad));

      if (existing.variants?.length) {
        const colors = [...new Set(existing.variants.map((v) => v.color).filter(Boolean))] as string[];
        const sizes = [...new Set(existing.variants.map((v) => v.size).filter(Boolean))] as string[];
        const options: VariantOption[] = [];
        if (colors.length) options.push({ id: crypto.randomUUID(), name: "Color", values: colors });
        if (sizes.length) options.push({ id: crypto.randomUUID(), name: "Size", values: sizes });
        setVariantOptions(options);
        setVariants(
          existing.variants.map((v) => ({
            key: [v.color, v.size].filter(Boolean).join(" / "),
            color: v.color ?? undefined,
            size: v.size ?? undefined,
            sku: v.sku,
            priceDelta: v.priceDelta,
            stockQuantity: String(v.stockQuantity),
            imageUrl: v.imageUrl ?? undefined,
          }))
        );
      }
      setIsCustomFabric(
        Boolean(existing.fabric) && !FABRIC_OPTIONS.includes(existing.fabric as (typeof FABRIC_OPTIONS)[number])
      );
    }
  }, [existing]);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      fabric: form.fabric,
      color: form.color,
      sareeLength: removedFields.has("sareeLength") || !form.sareeLength ? undefined : Number(form.sareeLength),
      weavingTechnique: removedFields.has("weavingTechnique") ? undefined : form.weavingTechnique || undefined,
      borderType: removedFields.has("borderType") ? undefined : form.borderType || undefined,
      palluDesign: removedFields.has("palluDesign") ? undefined : form.palluDesign || undefined,
      designPattern: removedFields.has("designPattern") ? undefined : form.designPattern || undefined,
      craftOrigin: removedFields.has("craftOrigin") ? undefined : form.craftOrigin || undefined,
      district: removedFields.has("district") ? undefined : form.district || undefined,
      blouseLength:
        removedFields.has("blouseLength") || !form.blouseLength ? undefined : Number(form.blouseLength),
      weightGrams: removedFields.has("weightGrams") || !form.weightGrams ? undefined : Number(form.weightGrams),
      washCare: removedFields.has("washCare") ? undefined : form.washCare || undefined,
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice),
      gstPercent: Number(form.gstPercent),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isTodaysDeal: form.isTodaysDeal,
      isLiveSpecial: form.isLiveSpecial,
      isTopSelection: form.isTopSelection,
      blouseIncluded: removedFields.has("blouseIncluded") ? undefined : form.blouseIncluded,
      isHandloom: form.isHandloom,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      categoryIds: form.categoryId ? [form.categoryId] : [],
      images: form.images.map((url, i) => ({ url, isPrimary: i === 0 })),
      variants: variants.length
        ? variants.map((v) => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            priceDelta: Number(v.priceDelta || 0),
            stockQuantity: Number(v.stockQuantity || 0),
            imageUrl: v.imageUrl || undefined,
          }))
        : undefined,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: payload });
        toast.success("Product updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Product created");
      }
      navigate("/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save product");
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">Loading product...</p>;
  }

  return (
    <div>
      <BackLink to="/products" label="Products" />
      <h1 className="mb-6 font-heading text-xl font-semibold text-neutral-800">
        {isEdit ? "Edit product" : "Add product"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="space-y-4">
                <Field label="Title" required>
                  <input
                    required
                    placeholder="e.g. Yeola Pure Silk Paithani – Peacock Motif"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Description"
                  hint={
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={generateDescriptionMutation.isPending}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 hover:text-royal-500 disabled:opacity-50"
                    >
                      {generateDescriptionMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : null}
                      Generate with AI
                    </button>
                  }
                >
                  <textarea
                    rows={6}
                    placeholder="Describe the fabric, craftsmanship and styling of this saree..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field label="Short Description">
                  <input
                    placeholder="One-line summary shown on product cards"
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            <Card title="Media">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              {form.images.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {form.images.map((url, index) => (
                    <div key={url.slice(0, 60) + index} className="group relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className={`aspect-[3/4] w-full rounded-lg object-cover ${
                          index === 0 ? "ring-2 ring-royal-500" : ""
                        }`}
                      />
                      {index === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-royal-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-600 shadow"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => makeImagePrimary(index)}
                          className="absolute inset-x-1 bottom-1 rounded bg-black/60 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Make primary
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 py-10 text-center hover:border-royal-300 hover:bg-royal-50/30 disabled:opacity-60"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
                    <p className="text-xs text-neutral-400">Uploading...</p>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 text-neutral-300" />
                    <p className="text-xs font-medium text-royal-600">
                      {form.images.length > 0 ? "Click to add more photos" : "Click to upload photos"}
                    </p>
                    <p className="text-[11px] text-neutral-400">JPG, PNG or WebP — select multiple at once</p>
                  </>
                )}
              </button>
            </Card>

            <Card title="Pricing">
              <div className="grid grid-cols-3 gap-4">
                <Field label="MRP (₹)" required>
                  <input required type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Selling Price (₹)" required>
                  <input
                    required
                    type="number"
                    value={form.sellingPrice}
                    onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="GST (%)">
                  <input type="number" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: e.target.value })} className={inputClass} />
                </Field>
              </div>
            </Card>

            <Card title="Inventory">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Quantity" required>
                  <input
                    required
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Low Stock Threshold">
                  <input
                    type="number"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            <Card title="Craft Details">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Fabric" required>
                  {isCustomFabric ? (
                    <div className="flex gap-2">
                      <input
                        required
                        autoFocus
                        placeholder="Enter fabric name"
                        value={form.fabric}
                        onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => handleFabricSelect(FABRIC_OPTIONS[0])}
                        className="shrink-0 rounded-lg border border-neutral-300 px-3 text-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      required
                      value={FABRIC_OPTIONS.includes(form.fabric as (typeof FABRIC_OPTIONS)[number]) ? form.fabric : ""}
                      onChange={(e) => handleFabricSelect(e.target.value)}
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select fabric
                      </option>
                      {FABRIC_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value="__custom__">Other (type your own)</option>
                    </select>
                  )}
                </Field>
                <Field label="Color" required>
                  <input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
                </Field>
                {!removedFields.has("sareeLength") && (
                  <Field label="Saree Length (m)" hint={<RemoveFieldButton onClick={() => removeField("sareeLength")} />}>
                    <input
                      type="number"
                      step="0.1"
                      value={form.sareeLength}
                      onChange={(e) => setForm({ ...form, sareeLength: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                )}
                {!removedFields.has("weavingTechnique") && (
                  <Field label="Weaving Technique" hint={<RemoveFieldButton onClick={() => removeField("weavingTechnique")} />}>
                    <input
                      placeholder="Handloom / Machine Made"
                      value={form.weavingTechnique}
                      onChange={(e) => setForm({ ...form, weavingTechnique: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                )}
                {!removedFields.has("borderType") && (
                  <Field label="Border Type" hint={<RemoveFieldButton onClick={() => removeField("borderType")} />}>
                    <input value={form.borderType} onChange={(e) => setForm({ ...form, borderType: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("palluDesign") && (
                  <Field label="Pallu Design" hint={<RemoveFieldButton onClick={() => removeField("palluDesign")} />}>
                    <input value={form.palluDesign} onChange={(e) => setForm({ ...form, palluDesign: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("designPattern") && (
                  <Field label="Design Pattern" hint={<RemoveFieldButton onClick={() => removeField("designPattern")} />}>
                    <input value={form.designPattern} onChange={(e) => setForm({ ...form, designPattern: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("craftOrigin") && (
                  <Field label="Craft Origin" hint={<RemoveFieldButton onClick={() => removeField("craftOrigin")} />}>
                    <input placeholder="e.g. Yeola" value={form.craftOrigin} onChange={(e) => setForm({ ...form, craftOrigin: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("district") && (
                  <Field label="District" hint={<RemoveFieldButton onClick={() => removeField("district")} />}>
                    <input placeholder="e.g. Nashik" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("blouseLength") && (
                  <Field label="Blouse Length (m)" hint={<RemoveFieldButton onClick={() => removeField("blouseLength")} />}>
                    <input
                      type="number"
                      step="0.1"
                      value={form.blouseLength}
                      onChange={(e) => setForm({ ...form, blouseLength: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                )}
                {!removedFields.has("weightGrams") && (
                  <Field label="Weight (grams)" hint={<RemoveFieldButton onClick={() => removeField("weightGrams")} />}>
                    <input type="number" value={form.weightGrams} onChange={(e) => setForm({ ...form, weightGrams: e.target.value })} className={inputClass} />
                  </Field>
                )}
              </div>
              {!removedFields.has("washCare") && (
                <Field
                  label="Wash Care Instructions"
                  className="mt-4"
                  hint={<RemoveFieldButton onClick={() => removeField("washCare")} />}
                >
                  <textarea rows={2} value={form.washCare} onChange={(e) => setForm({ ...form, washCare: e.target.value })} className={inputClass} />
                </Field>
              )}

              {removedFields.size > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                  <span className="text-xs text-neutral-400">Removed:</span>
                  {[...removedFields].map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => restoreField(field)}
                      className="flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-500 hover:border-royal-400 hover:text-royal-600"
                    >
                      <Plus className="h-3 w-3" /> {REMOVABLE_FIELDS[field]}
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <VariantsCard
              options={variantOptions}
              onOptionsChange={setVariantOptions}
              variants={variants}
              onVariantsChange={setVariants}
              baseSku={form.sku}
            />

            <Card title="Search Engine Listing">
              <div className="space-y-4">
                <Field label="Meta Title">
                  <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Meta Description">
                  <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputClass} />
                </Field>
              </div>
            </Card>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <Card title="Status">
              <select
                value={form.isActive ? "active" : "draft"}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </Card>

            <Card title="Product Organization">
              <Field label="Category">
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.group === "MAHARASHTRIAN" ? "🪷 " : ""}
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="SKU" required className="mt-4">
                <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Slug" required className="mt-4">
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
              </Field>
            </Card>

            <Card title="Merchandising">
              <div className="space-y-2.5">
                {(
                  [
                    ["isFeatured", "Featured"],
                    ["isNewArrival", "New Arrival"],
                    ["isBestSeller", "Bestseller"],
                    ["isTodaysDeal", "Today's Deal"],
                    ["isLiveSpecial", "Live Special Today"],
                    ["isTopSelection", "Top Selection"],
                    ["isHandloom", "Handloom"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="h-4 w-4 rounded border-neutral-300 text-royal-600 focus:ring-royal-500"
                    />
                    {label}
                  </label>
                ))}
                {!removedFields.has("blouseIncluded") && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                      <input
                        type="checkbox"
                        checked={form.blouseIncluded}
                        onChange={(e) => setForm({ ...form, blouseIncluded: e.target.checked })}
                        className="h-4 w-4 rounded border-neutral-300 text-royal-600 focus:ring-royal-500"
                      />
                      Blouse Included
                    </label>
                    <RemoveFieldButton onClick={() => removeField("blouseIncluded")} />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6">
          <button type="button" onClick={() => navigate("/products")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
