import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useBanners, useCreateBanner, useUpdateBanner, type BannerPlacement } from "@/admin/hooks/api/useBanners";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";

const emptyForm = { title: "", imageUrl: "", linkUrl: "", placement: "HOMEPAGE_SLIDER" as BannerPlacement, sortOrder: "0", isActive: true };

const PLACEMENT_GUIDANCE: Record<BannerPlacement, string> = {
  HOMEPAGE_SLIDER: "Recommended 1600 × 600px (wide banner), landscape orientation, under 1 MB.",
  FESTIVAL_BANNER: "Recommended 1600 × 500px (wide banner), landscape orientation, under 1 MB.",
  OFFER_BANNER: "Recommended 1200 × 400px (wide banner), landscape orientation, under 1 MB.",
  COLLECTION_BANNER: "Recommended 1200 × 900px (portrait or square), under 1 MB.",
  POPUP_BANNER: "Recommended 800 × 800px (square), under 1 MB.",
};

export function BannerForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: banners, isLoading } = useBanners();
  const banner = banners?.find((b) => b.id === id) ?? null;
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const uploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);

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
    if (banner) {
      setForm({
        title: banner.title,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl ?? "",
        placement: banner.placement,
        sortOrder: String(banner.sortOrder),
        isActive: banner.isActive,
      });
    }
  }, [banner]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.imageUrl) {
      toast.error("Please upload a banner image");
      return;
    }

    const payload = {
      title: form.title,
      imageUrl: form.imageUrl,
      linkUrl: form.linkUrl || undefined,
      placement: form.placement,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: payload });
        toast.success("Banner updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Banner created");
      }
      navigate("/banners");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save banner");
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">Loading banner...</p>;
  }

  return (
    <div>
      <BackLink to="/banners" label="Back to Banners" />
      <PageHeader title={isEdit ? "Edit Banner" : "Add Banner"} description={isEdit ? form.title : "Create a new promotional banner."} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label="Title" required>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Banner Image" required>
          <p className="mb-2 text-xs text-neutral-500">
            {PLACEMENT_GUIDANCE[form.placement]} Max file size 3 MB. JPG, PNG or WebP.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {form.imageUrl ? (
            <div className="relative w-full max-w-xs">
              <img src={form.imageUrl} alt="Banner preview" className="aspect-video w-full rounded-lg object-cover" />
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
                  <p className="text-xs font-medium text-royal-600">Click to upload a banner image</p>
                  <p className="text-[11px] text-neutral-400">JPG, PNG or WebP</p>
                </>
              )}
            </button>
          )}
        </Field>
        <Field label="Link URL">
          <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="/collection/festive" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Placement" required>
            <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })} className={inputClass}>
              <option value="HOMEPAGE_SLIDER">Homepage Slider</option>
              <option value="FESTIVAL_BANNER">Festival Banner</option>
              <option value="OFFER_BANNER">Offer Banner</option>
              <option value="COLLECTION_BANNER">Collection Banner</option>
              <option value="POPUP_BANNER">Popup Banner</option>
            </select>
          </Field>
          <Field label="Sort Order">
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
          Active
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/banners")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
