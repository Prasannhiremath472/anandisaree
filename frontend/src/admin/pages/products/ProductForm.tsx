import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, X, Minus, Plus } from "lucide-react";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Card } from "@/admin/components/ui/Card";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { SearchableSelect } from "@/admin/components/ui/SearchableSelect";
import { SearchableMultiSelect } from "@/admin/components/ui/SearchableMultiSelect";
import { useCreateProduct, useGenerateDescription, useNextSku, useProduct, useUpdateProduct } from "@/admin/hooks/api/useProducts";
import { useCategories } from "@/admin/hooks/api/useCategories";
import { useCreateProductTag, useProductTags } from "@/admin/hooks/api/useProductTags";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";
import { useAppSelector } from "@/admin/hooks/redux";
import { VariantsCard, type VariantOption, type VariantRow } from "./VariantsCard";
import { FABRIC_OPTIONS, WASH_CARE_BY_FABRIC } from "./fabricOptions";
import { ALL_PRODUCT_OPTIONAL_FIELDS, type ProductOptionalField } from "./productFields";
import type { ProductStatus } from "@/admin/types/product";

type RemovableField = ProductOptionalField;

function RemoveFieldButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("productForm.removeFieldButton")}
      className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-600"
    >
      <Minus className="h-3 w-3" /> {t("productForm.removeFieldButton")}
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
  blouseLength: "0.8",
  weightGrams: "",
  washCare: "",

  // Flags
  isActive: true,
  status: "ACTIVE" as ProductStatus,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isTodaysDeal: false,
  isLiveSpecial: false,
  isTopSelection: false,
  blouseIncluded: true,
  isHandloom: false,
};

export function ProductForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const { data: existing, isLoading } = useProduct(id ?? null);
  const { data: categories } = useCategories();
  const { data: productTags } = useProductTags();
  const createTagMutation = useCreateProductTag();
  const [tagNames, setTagNames] = useState<string[]>([]);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useImageUpload();
  const generateDescriptionMutation = useGenerateDescription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // When adding a product from a specific category tab (not "All
  // Categories"), the Category field is locked to that category — the
  // dropdown only offers it, matching the field-set the form is already
  // scoped to. Editing an existing product, or adding one from "All
  // Categories", still allows picking any category. The URL param is only
  // meaningful on first load; once on this screen, the active tab (Redux)
  // is the live source of truth.
  const urlCategoryId = searchParams.get("categoryId");
  const lockedCategoryId = isEdit ? null : selectedCategoryId ?? urlCategoryId ?? null;
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    categoryId: lockedCategoryId ?? "",
  }));

  // Keep the form's category (and therefore the locked dropdown + visible
  // field set) in sync when the admin switches the category tab while
  // already sitting on this screen, instead of only picking it up on mount.
  useEffect(() => {
    if (isEdit) return;
    setForm((f) => (f.categoryId === (lockedCategoryId ?? "") ? f : { ...f, categoryId: lockedCategoryId ?? "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedCategoryId, isEdit]);
  // Auto-fill SKU from the category-based sequence for new products; the
  // field is read-only in that case (see the SKU Field below), re-fetching
  // and re-filling whenever the selected category changes.
  const { data: nextSku } = useNextSku(!isEdit ? form.categoryId || undefined : undefined);
  useEffect(() => {
    if (isEdit || !nextSku) return;
    setForm((f) => ({ ...f, sku: nextSku }));
  }, [nextSku, isEdit]);

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [isCustomFabric, setIsCustomFabric] = useState(false);

  // Selling Price + GST, shown read-only in the Pricing card so the admin can
  // see the final customer-facing price without doing the math themselves.
  const totalPriceDisplay = (() => {
    const sellingPrice = Number(form.sellingPrice);
    const gstPercent = Number(form.gstPercent);
    if (!form.sellingPrice || Number.isNaN(sellingPrice)) return "";
    const gst = Number.isNaN(gstPercent) ? 0 : gstPercent;
    const total = sellingPrice + (sellingPrice * gst) / 100;
    return `₹${total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  })();
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
      toast.error(t("productForm.addTitleFabricColorFirst"));
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
      toast.success(t("productForm.descriptionGenerated"));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("productForm.couldNotGenerateDescription"));
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
        toast.error(err?.response?.data?.message ?? t("productForm.failedToUploadFile", { filename: file.name }));
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
        blouseLength: existing.blouseLength ?? "",
        weightGrams: existing.weightGrams ? String(existing.weightGrams) : "",
        washCare: existing.washCare ?? "",
        isActive: existing.isActive,
        status: existing.status,
        isFeatured: existing.isFeatured,
        isNewArrival: existing.isNewArrival,
        isBestSeller: existing.isBestSeller,
        isTodaysDeal: existing.isTodaysDeal,
        isLiveSpecial: existing.isLiveSpecial ?? false,
        isTopSelection: existing.isTopSelection ?? false,
        blouseIncluded: existing.blouseIncluded,
        isHandloom: existing.isHandloom,
      });
      setTagNames(existing.tags?.map((t) => t.tag.name) ?? []);

      // Fields that were never set on this product start out removed from
      // view, rather than showing a wall of blank optional inputs.
      const emptyOnLoad: RemovableField[] = [];
      if (!existing.sareeLength) emptyOnLoad.push("sareeLength");
      if (!existing.weavingTechnique) emptyOnLoad.push("weavingTechnique");
      if (!existing.borderType) emptyOnLoad.push("borderType");
      if (!existing.palluDesign) emptyOnLoad.push("palluDesign");
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

  async function resolveTagIds(): Promise<string[]> {
    const ids: string[] = [];
    for (const name of tagNames) {
      const existingTag = productTags?.find((tg) => tg.name.toLowerCase() === name.toLowerCase());
      if (existingTag) {
        ids.push(existingTag.id);
      } else {
        const created = await createTagMutation.mutateAsync(name);
        ids.push(created.id);
      }
    }
    return ids;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tagIds = await resolveTagIds();

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
      status: form.status,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isTodaysDeal: form.isTodaysDeal,
      isLiveSpecial: form.isLiveSpecial,
      isTopSelection: form.isTopSelection,
      blouseIncluded: removedFields.has("blouseIncluded") ? undefined : form.blouseIncluded,
      isHandloom: form.isHandloom,
      categoryIds: form.categoryId ? [form.categoryId] : [],
      tagIds,
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
        toast.success(t("productForm.productUpdated"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("productForm.productCreated"));
      }
      navigate("/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("productForm.failedToSaveProduct"));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">{t("productForm.loadingProduct")}</p>;
  }

  return (
    <div>
      <BackLink to="/products" label={t("productForm.backToProducts")} />
      <h1 className="mb-6 font-heading text-xl font-semibold text-neutral-800">
        {isEdit ? t("productForm.editProduct") : t("productForm.addProduct")}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="space-y-4">
                <Field label={t("common.title")} required>
                  <input
                    required
                    placeholder={t("productForm.titlePlaceholder")}
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label={t("common.description")}
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
                      {t("productForm.generateWithAI")}
                    </button>
                  }
                >
                  <textarea
                    rows={6}
                    placeholder={t("productForm.descriptionPlaceholder")}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <Field label={t("productForm.shortDescription")}>
                  <input
                    placeholder={t("productForm.shortDescriptionPlaceholder")}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            <Card title={t("productForm.media")}>
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
                        alt={t("productForm.imageAlt", { index: index + 1 })}
                        className={`aspect-[3/4] w-full rounded-lg object-cover ${
                          index === 0 ? "ring-2 ring-royal-500" : ""
                        }`}
                      />
                      {index === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-royal-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {t("productForm.primary")}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={t("productForm.removeImage")}
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
                          {t("productForm.makePrimary")}
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
                    <p className="text-xs text-neutral-400">{t("productForm.uploading")}</p>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 text-neutral-300" />
                    <p className="text-xs font-medium text-royal-600">
                      {form.images.length > 0 ? t("productForm.clickToAddMorePhotos") : t("productForm.clickToUploadPhotos")}
                    </p>
                    <p className="text-[11px] text-neutral-400">{t("productForm.photoHint")}</p>
                  </>
                )}
              </button>
            </Card>

            <Card title={t("productForm.pricing")}>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("productForm.mrp")} required>
                  <input required type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t("productForm.sellingPrice")} required>
                  <input
                    required
                    type="number"
                    value={form.sellingPrice}
                    onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("productForm.gst")}>
                  <input type="number" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t("productForm.totalPrice")}>
                  <input
                    disabled
                    value={totalPriceDisplay}
                    className={`${inputClass} cursor-not-allowed bg-neutral-50 text-neutral-500`}
                  />
                </Field>
              </div>
            </Card>

            <VariantsCard
              options={variantOptions}
              onOptionsChange={setVariantOptions}
              variants={variants}
              onVariantsChange={setVariants}
              baseSku={form.sku}
            />
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <Card title={t("productForm.status")}>
              <select
                value={form.status}
                onChange={(e) => {
                  const status = e.target.value as ProductStatus;
                  setForm({ ...form, status, isActive: status !== "INACTIVE" });
                }}
                className={inputClass}
              >
                <option value="ACTIVE">{t("status.ACTIVE")}</option>
                <option value="INACTIVE">{t("status.INACTIVE")}</option>
                <option value="OUT_OF_STOCK">{t("status.OUT_OF_STOCK")}</option>
              </select>
            </Card>

            <Card title={t("productForm.productOrganization")}>
              <Field label={t("productForm.category")}>
                {lockedCategoryId ? (
                  <>
                    <select value={form.categoryId} disabled className={`${inputClass} bg-neutral-50 text-neutral-500`}>
                      {(() => {
                        const c = categories?.find((cat) => cat.id === lockedCategoryId);
                        return (
                          <option value={lockedCategoryId}>
                            {c ? `${c.group === "MAHARASHTRIAN" ? "🪷 " : ""}${c.name}` : t("productForm.loadingEllipsis")}
                          </option>
                        );
                      })()}
                    </select>
                    <p className="mt-1 text-xs text-neutral-400">
                      {t("productForm.lockedCategoryHint")}
                    </p>
                  </>
                ) : (
                  <SearchableSelect
                    value={form.categoryId}
                    onChange={(categoryId) => setForm({ ...form, categoryId })}
                    placeholder={t("productForm.selectCategory")}
                    options={
                      categories?.map((c) => ({
                        value: c.id,
                        label: `${c.group === "MAHARASHTRIAN" ? "🪷 " : ""}${c.name}`,
                      })) ?? []
                    }
                  />
                )}
              </Field>
              <Field label={t("productForm.sku")} required className="mt-4">
                <input
                  required
                  readOnly={!isEdit}
                  value={form.sku || (isEdit ? "" : t("productForm.skuPending"))}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className={`${inputClass} ${!isEdit ? "cursor-not-allowed bg-neutral-50 text-neutral-500" : ""}`}
                />
                {!isEdit && <p className="mt-1 text-xs text-neutral-400">{t("productForm.skuAutoHint")}</p>}
              </Field>
              <Field label={t("common.slug")} required className="mt-4">
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
              </Field>
            </Card>

            <Card title={t("productForm.inventory")}>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("productForm.stockQuantity")} required>
                  <input
                    required
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("productForm.lowStockThreshold")}>
                  <input
                    type="number"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            <Card title={t("productForm.craftDetails")}>
              <div className="grid grid-cols-3 gap-4">
                <Field label={t("productForm.fabric")} required>
                  {isCustomFabric ? (
                    <div className="flex gap-2">
                      <input
                        required
                        autoFocus
                        placeholder={t("productForm.enterFabricName")}
                        value={form.fabric}
                        onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => handleFabricSelect(FABRIC_OPTIONS[0])}
                        className="shrink-0 rounded-lg border border-neutral-300 px-3 text-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        {t("common.cancel")}
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
                        {t("productForm.selectFabric")}
                      </option>
                      {FABRIC_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value="__custom__">{t("productForm.otherTypeYourOwn")}</option>
                    </select>
                  )}
                </Field>
                <Field label={t("productForm.color")} required>
                  <input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
                </Field>
                {!removedFields.has("sareeLength") && (
                  <Field label={t("productForm.sareeLength")} hint={<RemoveFieldButton onClick={() => removeField("sareeLength")} />}>
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
                  <Field label={t("productForm.weavingTechnique")} hint={<RemoveFieldButton onClick={() => removeField("weavingTechnique")} />}>
                    <input
                      placeholder={t("productForm.weavingTechniquePlaceholder")}
                      value={form.weavingTechnique}
                      onChange={(e) => setForm({ ...form, weavingTechnique: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                )}
                {!removedFields.has("borderType") && (
                  <Field label={t("productForm.borderType")} hint={<RemoveFieldButton onClick={() => removeField("borderType")} />}>
                    <input value={form.borderType} onChange={(e) => setForm({ ...form, borderType: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("palluDesign") && (
                  <Field label={t("productForm.palluDesign")} hint={<RemoveFieldButton onClick={() => removeField("palluDesign")} />}>
                    <input value={form.palluDesign} onChange={(e) => setForm({ ...form, palluDesign: e.target.value })} className={inputClass} />
                  </Field>
                )}
                {!removedFields.has("blouseLength") && (
                  <Field label={t("productForm.blouseLength")} hint={<RemoveFieldButton onClick={() => removeField("blouseLength")} />}>
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
                  <Field label={t("productForm.weightGrams")} hint={<RemoveFieldButton onClick={() => removeField("weightGrams")} />}>
                    <input type="number" value={form.weightGrams} onChange={(e) => setForm({ ...form, weightGrams: e.target.value })} className={inputClass} />
                  </Field>
                )}
              </div>
              {!removedFields.has("washCare") && (
                <Field
                  label={t("productForm.washCare")}
                  className="mt-4"
                  hint={<RemoveFieldButton onClick={() => removeField("washCare")} />}
                >
                  <textarea rows={2} value={form.washCare} onChange={(e) => setForm({ ...form, washCare: e.target.value })} className={inputClass} />
                </Field>
              )}

              {removedFields.size > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                  <span className="text-xs text-neutral-400">{t("productForm.removedLabel")}</span>
                  {[...removedFields].map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => restoreField(field)}
                      className="flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-500 hover:border-royal-400 hover:text-royal-600"
                    >
                      <Plus className="h-3 w-3" /> {t(`productFields.${field}`)}
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card title={t("productForm.merchandising")}>
              <div className="space-y-2.5">
                {(
                  [
                    ["isFeatured", t("productForm.featured")],
                    ["isNewArrival", t("productForm.newArrival")],
                    ["isBestSeller", t("productForm.bestseller")],
                    ["isTodaysDeal", t("productForm.todaysDeal")],
                    ["isLiveSpecial", t("productForm.liveSpecialToday")],
                    ["isTopSelection", t("productForm.topSelection")],
                    ["isHandloom", t("productForm.handloom")],
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
                      {t("productForm.blouseIncluded")}
                    </label>
                    <RemoveFieldButton onClick={() => removeField("blouseIncluded")} />
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <label className="text-sm font-medium text-neutral-700">{t("productForm.customTags")}</label>
                <p className="mt-0.5 text-xs text-neutral-400">{t("productForm.customTagsHint")}</p>
                <SearchableMultiSelect
                  className="mt-1.5"
                  suggestions={productTags?.map((tg) => tg.name) ?? []}
                  values={tagNames}
                  onChange={setTagNames}
                  placeholder={t("productForm.addTagPlaceholder")}
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6">
          <button type="button" onClick={() => navigate("/products")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {saving ? t("common.saving") : isEdit ? t("common.saveChanges") : t("productForm.createProduct")}
          </button>
        </div>
      </form>
    </div>
  );
}
