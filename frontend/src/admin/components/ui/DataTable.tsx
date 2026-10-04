import { useTranslation } from "react-i18next";
import { cn } from "@/admin/utils";

export interface Column<T> {
  header: string;
  key: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  stickyRight?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, rowKey, loading, emptyMessage, onRowClick }: DataTableProps<T>) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="border-b border-black/5 bg-neutral-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2 font-heading font-semibold text-neutral-600",
                  col.stickyRight && "sticky right-0 z-10 bg-neutral-50 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.12)]",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-neutral-400">
                {t("common.loading")}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-neutral-400">
                {emptyMessage ?? t("common.noRecordsFound")}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-black/5 last:border-0 hover:bg-royal-50/40",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-3 py-1.5 text-neutral-700",
                      col.stickyRight && "sticky right-0 z-10 bg-white shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.12)]",
                      col.className
                    )}
                  >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
