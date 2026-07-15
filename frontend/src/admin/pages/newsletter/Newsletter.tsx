import { useState } from "react";
import toast from "react-hot-toast";
import { Download, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { apiClient } from "@/admin/api/client";
import { useDeleteSubscriber, useSubscribers, type Subscriber } from "@/admin/hooks/api/useNewsletter";

export function Newsletter() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading } = useSubscribers({ page, pageSize: 15, search: search || undefined });
  const deleteMutation = useDeleteSubscriber();

  async function handleExport() {
    setExporting(true);
    try {
      const res = await apiClient.get("/admin/newsletter/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "newsletter-subscribers.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to export subscribers");
    } finally {
      setExporting(false);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Subscriber removed");
      setDeletingId(null);
    } catch {
      toast.error("Failed to remove subscriber");
    }
  }

  const columns: Column<Subscriber>[] = [
    { header: "Email", key: "email" },
    { header: "Subscribed On", key: "createdAt", render: (s) => new Date(s.createdAt).toLocaleDateString("en-IN") },
    { header: "Status", key: "isSubscribed", render: (s) => <StatusBadge status={s.isSubscribed ? "ACTIVE" : "INACTIVE"} /> },
    {
      header: "Actions",
      key: "actions",
      render: (s) => (
        <button onClick={() => setDeletingId(s.id)} aria-label="Remove" className="text-neutral-400 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Manage your email subscriber list."
        actions={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Export CSV"}
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by email..." />
      </div>

      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(s) => s.id} loading={isLoading} emptyMessage="No subscribers yet." />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Remove subscriber?"
        description="This email will be removed from your newsletter list."
        confirmLabel="Remove"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
