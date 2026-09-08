import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useBanners, useDeleteBanner, type BannerPlacement } from "@/admin/hooks/api/useBanners";

const PLACEMENT_LABEL_KEYS: Record<BannerPlacement, string> = {
  HOMEPAGE_SLIDER: "bannerForm.placementHomepageSlider",
  FESTIVAL_BANNER: "bannerForm.placementFestivalBanner",
  OFFER_BANNER: "bannerForm.placementOfferBanner",
  COLLECTION_BANNER: "bannerForm.placementCollectionBanner",
  POPUP_BANNER: "bannerForm.placementPopupBanner",
};

export function Banners() {
  const { t } = useTranslation();
  const { data: banners, isLoading } = useBanners();
  const deleteMutation = useDeleteBanner();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success(t("banners.bannerDeleted"));
      setDeletingId(null);
    } catch {
      toast.error(t("banners.failedToDeleteBanner"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("banners.title")}
        description={t("banners.description")}
        actions={
          <Link
            to="/banners/new"
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> {t("banners.addBanner")}
          </Link>
        }
      />

      {isLoading ? (
        <p className="text-neutral-400">{t("common.loading")}</p>
      ) : !banners?.length ? (
        <p className="rounded-xl border border-black/5 bg-white py-10 text-center text-neutral-400">{t("banners.emptyMessage")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {banners.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="h-32 w-full cursor-pointer object-cover"
                onClick={() => navigate(`/banners/${b.id}/edit`)}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-neutral-800">{b.title}</p>
                    <p className="text-xs text-neutral-400">{t(PLACEMENT_LABEL_KEYS[b.placement])}</p>
                  </div>
                  <StatusBadge status={b.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Link to={`/banners/${b.id}/edit`} className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700">
                    <Pencil className="h-3.5 w-3.5" /> {t("common.edit")}
                  </Link>
                  <button onClick={() => setDeletingId(b.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" /> {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title={t("banners.deleteConfirmTitle")}
        description={t("banners.deleteConfirmDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
