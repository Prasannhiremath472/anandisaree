import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useBanners, useCreateBanner, useUpdateBanner, type BannerPlacement } from "@/admin/hooks/api/useBanners";
import { useImageUpload } from "@/admin/hooks/api/useImageUpload";

const emptyForm = { title: "", subtitle: "", imageUrl: "", mobileImageUrl: "", linkUrl: "", ctaLabel: "", placement: "HOMEPAGE_SLIDER" as BannerPlacement, sortOrder: "0", isActive: true };

export function BannerForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: banners, isLoading } = useBanners();
  const banner = banners?.find((b) => b.id === id) ?? null;
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const uploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "mobileImageUrl") {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const { dataUri } = await uploadMutation.mutateAsync(file);
      setForm((f) => ({ ...f, [field]: dataUri }));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("bannerForm.failedToUploadImage"));
    }
  }

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title,
        subtitle: banner.subtitle ?? "",
        imageUrl: banner.imageUrl,
        mobileImageUrl: banner.mobileImageUrl ?? "",
        linkUrl: banner.linkUrl ?? "",
        ctaLabel: banner.ctaLabel ?? "",
        placement: banner.placement,
        sortOrder: String(banner.sortOrder),
        isActive: banner.isActive,
      });
    }
  }, [banner]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.imageUrl) {
      toast.error(t("bannerForm.pleaseUploadBannerImage"));
      return;
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      imageUrl: form.imageUrl,
      mobileImageUrl: form.mobileImageUrl || undefined,
      linkUrl: form.linkUrl || undefined,
      ctaLabel: form.ctaLabel || undefined,
      placement: form.placement,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: payload });
        toast.success(t("bannerForm.bannerUpdated"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("bannerForm.bannerCreated"));
      }
      navigate("/banners");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("bannerForm.failedToSaveBanner"));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">{t("bannerForm.loadingBanner")}</p>;
  }

  return (
    <div>
      <BackLink to="/banners" label={t("bannerForm.backToBanners")} />
      <PageHeader title={isEdit ? t("bannerForm.editBanner") : t("bannerForm.addBanner")} description={isEdit ? form.title : t("bannerForm.createNewBanner")} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label={t("common.title")} required>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label={t("bannerForm.subtitle")}>
          <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder={t("bannerForm.subtitlePlaceholder")} className={inputClass} />
        </Field>
        <Field label={t("bannerForm.bannerImage")} required>
          <p className="mb-2 text-xs text-neutral-500">
            {t(`bannerForm.guidance.${form.placement}`)} {t("bannerForm.maxFileSizeHint")}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "imageUrl")}
            className="hidden"
          />
          {form.imageUrl ? (
            <div className="relative w-full max-w-xs">
              <img src={form.imageUrl} alt={t("bannerForm.bannerPreviewAlt")} className="aspect-video w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, imageUrl: "" })}
                aria-label={t("common.remove")}
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
                  <p className="text-xs text-neutral-400">{t("productForm.uploading")}</p>
                </>
              ) : (
                <>
                  <ImagePlus className="h-6 w-6 text-neutral-300" />
                  <p className="text-xs font-medium text-royal-600">{t("bannerForm.clickToUploadBannerImage")}</p>
                  <p className="text-[11px] text-neutral-400">{t("bannerForm.photoFormatsHint")}</p>
                </>
              )}
            </button>
          )}
        </Field>
        <Field label={t("bannerForm.mobileBannerImage")}>
          <p className="mb-2 text-xs text-neutral-500">{t("bannerForm.mobileImageHint")}</p>
          <input
            ref={mobileFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "mobileImageUrl")}
            className="hidden"
          />
          {form.mobileImageUrl ? (
            <div className="relative w-32">
              <img src={form.mobileImageUrl} alt={t("bannerForm.mobileBannerPreviewAlt")} className="aspect-[9/16] w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setForm({ ...form, mobileImageUrl: "" })}
                aria-label={t("common.remove")}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-600 shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => mobileFileInputRef.current?.click()}
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
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("common.linkUrl")}>
            <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder={t("bannerForm.linkUrlPlaceholder")} className={inputClass} />
          </Field>
          <Field label={t("bannerForm.ctaLabel")}>
            <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder={t("bannerForm.ctaLabelPlaceholder")} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("bannerForm.placement")} required>
            <select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as BannerPlacement })} className={inputClass}>
              <option value="HOMEPAGE_SLIDER">{t("bannerForm.placementHomepageSlider")}</option>
              <option value="FESTIVAL_BANNER">{t("bannerForm.placementFestivalBanner")}</option>
              <option value="OFFER_BANNER">{t("bannerForm.placementOfferBanner")}</option>
              <option value="COLLECTION_BANNER">{t("bannerForm.placementCollectionBanner")}</option>
              <option value="POPUP_BANNER">{t("bannerForm.placementPopupBanner")}</option>
            </select>
          </Field>
          <Field label={t("common.sortOrder")}>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
          {t("common.active")}
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/banners")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? t("common.saving") : isEdit ? t("common.saveChanges") : t("bannerForm.createBanner")}
          </button>
        </div>
      </form>
    </div>
  );
}
