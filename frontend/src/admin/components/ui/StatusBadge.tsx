import { cn } from "@/admin/utils";

const COLOR_MAP: Record<string, string> = {
  // Order statuses
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-neutral-200 text-neutral-700",
  // Payment statuses
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  // Review statuses
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  SPAM: "bg-neutral-200 text-neutral-700",
  // Generic
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        COLOR_MAP[status] ?? "bg-neutral-200 text-neutral-700"
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")}
    </span>
  );
}
