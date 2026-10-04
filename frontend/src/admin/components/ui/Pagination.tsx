import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip } from "@/admin/components/ui/Tooltip";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
      <span>{t("common.showingRange", { start, end, total })}</span>
      <div className="flex items-center gap-1.5">
        <Tooltip label={t("common.previousPage")}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-200 disabled:opacity-40"
            aria-label={t("common.previousPage")}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
        <span className="min-w-[70px] text-center">{t("common.pageOf", { page, totalPages })}</span>
        <Tooltip label={t("common.nextPage")}>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-200 disabled:opacity-40"
            aria-label={t("common.nextPage")}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
