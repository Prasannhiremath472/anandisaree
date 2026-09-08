import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Play, ExternalLink } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useReels, useDeleteReel } from "@/admin/hooks/api/useReels";
import { useAppSelector } from "@/admin/hooks/redux";

function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export function Reels() {
  const { t } = useTranslation();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);
  const { data: reels, isLoading } = useReels(selectedCategoryId ?? undefined);
  const deleteMutation = useDeleteReel();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success(t("reels.reelDeleted"));
      setDeletingId(null);
    } catch {
      toast.error(t("reels.failedToDeleteReel"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("reels.title")}
        description={t("reels.description")}
        actions={
          <Link
            to="/reels/new"
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> {t("reels.addReel")}
          </Link>
        }
      />

      {isLoading ? (
        <p className="text-neutral-400">{t("common.loading")}</p>
      ) : !reels?.length ? (
        <p className="rounded-xl border border-black/5 bg-white py-10 text-center text-neutral-400">
          {selectedCategoryId ? t("reels.emptyMessageInCategory") : t("reels.emptyMessage")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {reels.map((r) => {
            const isVideoFile = isDirectVideoFile(r.videoUrl);
            return (
              <div key={r.id} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
                <a
                  href={r.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("reels.openReelAria", { caption: r.caption })}
                  className="group relative block aspect-[9/16] w-full overflow-hidden bg-neutral-900"
                >
                  {isVideoFile ? (
                    <video
                      src={r.videoUrl}
                      poster={r.thumbnailUrl ?? undefined}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : r.thumbnailUrl ? (
                    <img src={r.thumbnailUrl} alt={r.caption} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-500">
                      <Play className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                    <ExternalLink className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </a>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-xs font-medium text-neutral-800">{r.caption}</p>
                    <StatusBadge status={r.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Link to={`/reels/${r.id}/edit`} className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700">
                      <Pencil className="h-3.5 w-3.5" /> {t("common.edit")}
                    </Link>
                    <button onClick={() => setDeletingId(r.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                      <Trash2 className="h-3.5 w-3.5" /> {t("common.delete")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title={t("reels.deleteConfirmTitle")}
        description={t("reels.deleteConfirmDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
