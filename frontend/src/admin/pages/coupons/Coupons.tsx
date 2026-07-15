import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useCoupons, useDeleteCoupon, type Coupon } from "@/admin/hooks/api/useCoupons";

export function Coupons() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useCoupons({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteCoupon();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Coupon deactivated");
      setDeletingId(null);
    } catch {
      toast.error("Failed to deactivate coupon");
    }
  }

  const columns: Column<Coupon>[] = [
    {
      header: "Code",
      key: "code",
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-neutral-800">{c.code}</span>
          {c.isFestival && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-medium text-gold-700">Festival</span>}
        </div>
      ),
    },
    {
      header: "Discount",
      key: "value",
      render: (c) => (c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FLAT" ? `₹${c.value}` : "BOGO"),
    },
    { header: "Min Order", key: "minOrderAmount", render: (c) => (c.minOrderAmount ? `₹${c.minOrderAmount}` : "—") },
    { header: "Usage", key: "usedCount", render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
    { header: "Status", key: "isActive", render: (c) => <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} /> },
    {
      header: "Actions",
      key: "actions",
      render: (c) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/coupons/${c.id}/edit`)} aria-label="Edit" className="text-neutral-500 hover:text-royal-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingId(c.id)} aria-label="Deactivate" className="text-neutral-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Manage discount codes and festival offers."
        actions={
          <Link
            to="/coupons/new"
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Coupon
          </Link>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search coupon code..." />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(c) => c.id}
        loading={isLoading}
        emptyMessage="No coupons yet."
        onRowClick={(c) => navigate(`/coupons/${c.id}/edit`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Deactivate coupon?"
        description="This coupon will no longer be usable by customers at checkout."
        confirmLabel="Deactivate"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
