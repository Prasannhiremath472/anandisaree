import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Check, Star, Trash2, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useDeleteReview, useReviews, useSetReviewFeatured, useUpdateReviewStatus, type Review } from "@/admin/hooks/api/useReviews";
import { useAppSelector } from "@/admin/hooks/redux";

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "SPAM"] as const;

export function Reviews() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("PENDING");
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const { data, isLoading } = useReviews({
    page,
    pageSize: 10,
    status: status === "ALL" ? undefined : status,
    categoryId: selectedCategoryId ?? undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);
  const statusMutation = useUpdateReviewStatus();
  const featuredMutation = useSetReviewFeatured();
  const deleteMutation = useDeleteReview();

  async function handleStatus(id: string, next: string) {
    try {
      await statusMutation.mutateAsync({ id, status: next });
      toast.success(t("reviews.reviewStatusUpdated", { status: next.toLowerCase() }));
    } catch {
      toast.error(t("reviews.failedToUpdateReview"));
    }
  }

  async function handleFeatured(review: Review) {
    try {
      await featuredMutation.mutateAsync({ id: review.id, isFeatured: !review.isFeatured });
      toast.success(review.isFeatured ? t("reviews.removedFromFeatured") : t("reviews.markedAsFeatured"));
    } catch {
      toast.error(t("reviews.failedToUpdateReview"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("reviews.reviewDeleted"));
    } catch {
      toast.error(t("reviews.failedToDeleteReview"));
    }
  }

  const columns: Column<Review>[] = [
    {
      header: t("reviews.columnProduct"),
      key: "product",
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.product.images[0]?.url ?? "https://placehold.co/40x50"} alt="" className="h-10 w-8 rounded object-cover" />
          <span className="text-neutral-700">{r.product.name}</span>
        </div>
      ),
    },
    { header: t("reviews.columnCustomer"), key: "user", render: (r) => r.user.name },
    {
      header: t("reviews.columnRating"),
      key: "rating",
      render: (r) => (
        <div className="flex items-center gap-1 text-gold-500">
          {Array.from({ length: r.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-gold-500" />
          ))}
        </div>
      ),
    },
    { header: t("reviews.columnComment"), key: "comment", render: (r) => <span className="line-clamp-2 max-w-xs text-neutral-600">{r.comment}</span> },
    { header: t("common.status"), key: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: t("common.actions"),
      key: "actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.status !== "APPROVED" && (
            <button onClick={() => handleStatus(r.id, "APPROVED")} aria-label={t("reviews.approveAria")} className="text-green-600 hover:text-green-700">
              <Check className="h-4 w-4" />
            </button>
          )}
          {r.status !== "REJECTED" && (
            <button onClick={() => handleStatus(r.id, "REJECTED")} aria-label={t("reviews.rejectAria")} className="text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleFeatured(r)}
            aria-label={t("reviews.toggleFeaturedAria")}
            className={r.isFeatured ? "text-gold-600" : "text-neutral-400 hover:text-gold-600"}
          >
            <Star className={r.isFeatured ? "h-4 w-4 fill-gold-500" : "h-4 w-4"} />
          </button>
          <button onClick={() => handleDelete(r.id)} aria-label={t("common.delete")} className="text-neutral-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={t("reviews.title")} description={t("reviews.description")} />

      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              status === s ? "bg-royal-gradient text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(r) => r.id} loading={isLoading} emptyMessage={t("reviews.emptyMessage")} />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
