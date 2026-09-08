import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useReels, useCreateReel, useUpdateReel } from "@/admin/hooks/api/useReels";
import { useCategoriesLookup } from "@/admin/hooks/api/useProducts";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";

const emptyForm = { caption: "", videoUrl: "", thumbnailUrl: "", categoryId: "", linkUrl: "", sortOrder: "0", isActive: true };

export function ReelForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: reels, isLoading } = useReels();
  const reel = reels?.find((r) => r.id === id) ?? null;
  const { data: categories } = useCategoriesLookup();
  const createMutation = useCreateReel();
  const updateMutation = useUpdateReel();
  const uploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);

  async function handleThumbnailSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const { dataUri } = await uploadMutation.mutateAsync(file);
      setForm((f) => ({ ...f, thumbnailUrl: dataUri }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("reelForm.failedToUploadThumbnail"));
    }
  }

  useEffect(() => {
    if (reel) {
      setForm({
        caption: reel.caption,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl ?? "",
        categoryId: reel.categoryId ?? "",
        linkUrl: reel.linkUrl ?? "",
        sortOrder: String(reel.sortOrder),
        isActive: reel.isActive,
      });
    }
  }, [reel]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      caption: form.caption,
      videoUrl: form.videoUrl,
      thumbnailUrl: form.thumbnailUrl || undefined,
      categoryId: form.categoryId || undefined,
      linkUrl: form.linkUrl || undefined,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: payload });
        toast.success(t("reelForm.reelUpdated"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("reelForm.reelCreated"));
      }
      navigate("/reels");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("reelForm.failedToSaveReel"));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">{t("reelForm.loadingReel")}</p>;
  }

  return (
    <div>
      <BackLink to="/reels" label={t("reelForm.backToReels")} />
      <PageHeader title={isEdit ? t("reelForm.editReel") : t("reelForm.addReel")} description={isEdit ? form.caption : t("reelForm.addNewStyleReel")} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label={t("reelForm.caption")} required>
          <input required value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} />
        </Field>

        <Field label={t("reelForm.videoUrl")} required>
          <p className="mb-2 text-xs text-neutral-500">
            {t("reelForm.videoUrlHint")}
          </p>
          <input
            required
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder={t("reelForm.videoUrlPlaceholder")}
            className={inputClass}
          />
        </Field>

        <Field label={t("reelForm.thumbnailImage")}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailSelect}
            className="hidden"
          />
          {form.thumbnailUrl ? (
            <div className="relative w-32">
              <img src={form.thumbnailUrl} alt={t("reelForm.thumbnailPreviewAlt")} className="aspect-[9/16] w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, thumbnailUrl: "" })}
                aria-label={t("reelForm.removeThumbnail")}
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
              className="flex w-32 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-neutral-200 py-6 text-center hover:border-royal-300 hover:bg-royal-50/30 disabled:opacity-60"
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-royal-500" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5 text-neutral-300" />
                  <p className="text-[11px] font-medium text-royal-600">{t("reelForm.upload")}</p>
                </>
              )}
            </button>
          )}
        </Field>

        <Field label={t("reelForm.category")}>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
            <option value="">{t("reelForm.noCategory")}</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("common.linkUrl")}>
          <input
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            placeholder={t("reelForm.linkUrlPlaceholder")}
            className={inputClass}
          />
        </Field>

        <Field label={t("common.sortOrder")}>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputClass} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
          {t("common.active")}
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/reels")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? t("common.saving") : isEdit ? t("common.saveChanges") : t("reelForm.createReel")}
          </button>
        </div>
      </form>
    </div>
  );
}
