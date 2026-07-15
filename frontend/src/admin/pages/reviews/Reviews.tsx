import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Star, Trash2, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useDeleteReview, useReviews, useSetReviewFeatured, useUpdateReviewStatus, type Review } from "@/admin/hooks/api/useReviews";

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "SPAM"] as const;

export function Reviews() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("PENDING");

  const { data, isLoading } = useReviews({ page, pageSize: 10, status: status === "ALL" ? undefined : status });
  const statusMutation = useUpdateReviewStatus();
  const featuredMutation = useSetReviewFeatured();
  const deleteMutation = useDeleteReview();

  async function handleStatus(id: string, next: string) {
    try {
      await statusMutation.mutateAsync({ id, status: next });
      toast.success(`Review ${next.toLowerCase()}`);
    } catch {
      toast.error("Failed to update review");
    }
  }

  async function handleFeatured(review: Review) {
    try {
      await featuredMutation.mutateAsync({ id: review.id, isFeatured: !review.isFeatured });
      toast.success(review.isFeatured ? "Removed from featured" : "Marked as featured");
    } catch {
      toast.error("Failed to update review");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  }

  const columns: Column<Review>[] = [
    {
      header: "Product",
      key: "product",
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.product.images[0]?.url ?? "https://placehold.co/40x50"} alt="" className="h-10 w-8 rounded object-cover" />
          <span className="text-neutral-700">{r.product.name}</span>
        </div>
      ),
    },
    { header: "Customer", key: "user", render: (r) => r.user.name },
    {
      header: "Rating",
      key: "rating",
      render: (r) => (
        <div className="flex items-center gap-1 text-gold-500">
          {Array.from({ length: r.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-gold-500" />
          ))}
        </div>
      ),
    },
    { header: "Comment", key: "comment", render: (r) => <span className="line-clamp-2 max-w-xs text-neutral-600">{r.comment}</span> },
    { header: "Status", key: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      key: "actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status !== "APPROVED" && (
            <button onClick={() => handleStatus(r.id, "APPROVED")} aria-label="Approve" className="text-green-600 hover:text-green-700">
              <Check className="h-4 w-4" />
            </button>
          )}
          {r.status !== "REJECTED" && (
            <button onClick={() => handleStatus(r.id, "REJECTED")} aria-label="Reject" className="text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleFeatured(r)}
            aria-label="Toggle featured"
            className={r.isFeatured ? "text-gold-600" : "text-neutral-400 hover:text-gold-600"}
          >
            <Star className={r.isFeatured ? "h-4 w-4 fill-gold-500" : "h-4 w-4"} />
          </button>
          <button onClick={() => handleDelete(r.id)} aria-label="Delete" className="text-neutral-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate customer reviews and manage featured testimonials." />

      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              status === s ? "bg-royal-gradient text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(r) => r.id} loading={isLoading} emptyMessage="No reviews found." />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
