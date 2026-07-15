import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Card } from "@/admin/components/ui/Card";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useCategoriesLookup, useCreateProduct, useProduct, useUpdateProduct } from "@/admin/hooks/api/useProducts";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";
import { VariantsCard, type VariantOption, type VariantRow } from "./VariantsCard";

const emptyForm = {
  // Core
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  categoryId: "",

  // Pricing & inventory
  mrp: "",
  sellingPrice: "",
  gstPercent: "5",
  stockQuantity: "0",
  lowStockThreshold: "5",
  dispatchDays: "2",
  deliveryEstimateDays: "7",

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

  const { data: existing, isLoading } = useProduct(id ?? null);
  const { data: categories } = useCategoriesLookup();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const { dataUri } = await uploadMutation.mutateAsync(file);
      setForm((f) => ({ ...f, imageUrl: dataUri }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to upload image");
    }
  }

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        slug: existing.slug,
        sku: existing.sku,
        shortDescription: existing.shortDescription ?? "",
        description: existing.description ?? "",
        imageUrl: existing.images[0]?.url ?? "",
        categoryId: existing.categories[0]?.category.id ?? "",
        mrp: existing.mrp,
        sellingPrice: existing.sellingPrice,
        gstPercent: existing.gstPercent,
        stockQuantity: String(existing.stockQuantity),
        lowStockThreshold: String(existing.lowStockThreshold),
        dispatchDays: "2",
        deliveryEstimateDays: "7",
        fabric: existing.fabric,
        color: existing.color,
        sareeLength: existing.sareeLength,
        weavingTechnique: existing.weavingTechnique ?? "",
        borderType: existing.borderType ?? "",
        palluDesign: existing.palluDesign ?? "",
        designPattern: existing.designPattern ?? "",
        craftOrigin: "",
        district: "",
        blouseLength: "0.8",
        weightGrams: "",
        washCare: "",
        isActive: existing.isActive,
        isFeatured: existing.isFeatured,
        isNewArrival: existing.isNewArrival,
        isBestSeller: existing.isBestSeller,
        isTodaysDeal: existing.isTodaysDeal,
        blouseIncluded: existing.blouseIncluded,
        isHandloom: existing.isHandloom,
        metaTitle: "",
        metaDescription: "",
      });

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
          }))
        );
      }
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
      sareeLength: Number(form.sareeLength),
      weavingTechnique: form.weavingTechnique || undefined,
      borderType: form.borderType || undefined,
      palluDesign: form.palluDesign || undefined,
      designPattern: form.designPattern || undefined,
      craftOrigin: form.craftOrigin || undefined,
      district: form.district || undefined,
      blouseLength: form.blouseLength ? Number(form.blouseLength) : undefined,
      weightGrams: form.weightGrams ? Number(form.weightGrams) : undefined,
      washCare: form.washCare || undefined,
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice),
      gstPercent: Number(form.gstPercent),
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      dispatchDays: Number(form.dispatchDays),
      deliveryEstimateDays: Number(form.deliveryEstimateDays),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isTodaysDeal: form.isTodaysDeal,
      blouseIncluded: form.blouseIncluded,
      isHandloom: form.isHandloom,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      categoryIds: form.categoryId ? [form.categoryId] : [],
      images: form.imageUrl ? [{ url: form.imageUrl, isPrimary: true }] : [],
      variants: variants.length
        ? variants.map((v) => ({
            sku: v.sku,
            color: v.color,
            size: v.size,
            priceDelta: Number(v.priceDelta || 0),
            stockQuantity: Number(v.stockQuantity || 0),
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

                <Field label="Description">
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
                onChange={handleFileSelect}
                className="hidden"
              />
              {form.imageUrl ? (
                <div className="relative w-40">
                  <img src={form.imageUrl} alt="Product preview" className="aspect-[3/4] w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    aria-label="Remove image"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-600 shadow"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
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
                      <p className="text-xs font-medium text-royal-600">Click to upload an image</p>
                      <p className="text-[11px] text-neutral-400">JPG, PNG or WebP</p>
                    </>
                  )}
                </button>
              )}
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

            <Card title="Shipping">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Dispatch Time (days)">
                  <input type="number" value={form.dispatchDays} onChange={(e) => setForm({ ...form, dispatchDays: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Delivery Estimate (days)">
                  <input
                    type="number"
                    value={form.deliveryEstimateDays}
                    onChange={(e) => setForm({ ...form, deliveryEstimateDays: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            <Card title="Craft Details">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Fabric" required>
                  <input required value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Color" required>
                  <input required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Saree Length (m)" required>
                  <input
                    required
                    type="number"
                    step="0.1"
                    value={form.sareeLength}
                    onChange={(e) => setForm({ ...form, sareeLength: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Weaving Technique">
                  <input
                    placeholder="Handloom / Machine Made"
                    value={form.weavingTechnique}
                    onChange={(e) => setForm({ ...form, weavingTechnique: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Border Type">
                  <input value={form.borderType} onChange={(e) => setForm({ ...form, borderType: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Pallu Design">
                  <input value={form.palluDesign} onChange={(e) => setForm({ ...form, palluDesign: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Design Pattern">
                  <input value={form.designPattern} onChange={(e) => setForm({ ...form, designPattern: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Craft Origin">
                  <input placeholder="e.g. Yeola" value={form.craftOrigin} onChange={(e) => setForm({ ...form, craftOrigin: e.target.value })} className={inputClass} />
                </Field>
                <Field label="District">
                  <input placeholder="e.g. Nashik" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Blouse Length (m)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.blouseLength}
                    onChange={(e) => setForm({ ...form, blouseLength: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Weight (grams)">
                  <input type="number" value={form.weightGrams} onChange={(e) => setForm({ ...form, weightGrams: e.target.value })} className={inputClass} />
                </Field>
              </div>
              <Field label="Wash Care Instructions" className="mt-4">
                <textarea rows={2} value={form.washCare} onChange={(e) => setForm({ ...form, washCare: e.target.value })} className={inputClass} />
              </Field>
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
                    ["blouseIncluded", "Blouse Included"],
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
