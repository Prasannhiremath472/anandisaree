import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useBanners, useDeleteBanner } from "@/admin/hooks/api/useBanners";

export function Banners() {
  const { data: banners, isLoading } = useBanners();
  const deleteMutation = useDeleteBanner();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Banner deleted");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete banner");
    }
  }

  return (
    <div>
      <PageHeader
        title="Banners"
        description="Manage homepage sliders, festival and offer banners."
        actions={
          <Link
            to="/banners/new"
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Banner
          </Link>
        }
      />

      {isLoading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : !banners?.length ? (
        <p className="rounded-xl border border-black/5 bg-white py-10 text-center text-neutral-400">No banners yet.</p>
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
                    <p className="text-xs text-neutral-400">{b.placement.replace(/_/g, " ")}</p>
                  </div>
                  <StatusBadge status={b.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Link to={`/banners/${b.id}/edit`} className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button onClick={() => setDeletingId(b.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
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
        title="Delete banner?"
        description="This banner will be permanently removed."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
