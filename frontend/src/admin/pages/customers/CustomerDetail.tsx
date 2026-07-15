import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useCustomer, useUpdateCustomerStatus } from "@/admin/hooks/api/useCustomers";

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomer(id ?? null);
  const statusMutation = useUpdateCustomerStatus();

  async function toggleStatus() {
    if (!customer) return;
    try {
      await statusMutation.mutateAsync({ id: customer.id, isActive: !customer.isActive });
      toast.success(customer.isActive ? "Customer deactivated" : "Customer activated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <div>
      <BackLink to="/customers" label="Back to Customers" />
      <PageHeader title={customer?.name ?? "Customer"} />

      {isLoading || !customer ? (
        <p className="py-10 text-center text-neutral-400">Loading...</p>
      ) : (
        <div className="max-w-3xl space-y-6 rounded-xl border border-black/5 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">{customer.email}</p>
              <p className="text-sm text-neutral-500">{customer.phone ?? "No phone on file"}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={customer.isActive ? "ACTIVE" : "INACTIVE"} />
              <button
                onClick={toggleStatus}
                disabled={statusMutation.isPending}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                {customer.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-neutral-50 p-4 text-center">
              <p className="font-heading text-xl font-semibold text-neutral-800">{customer._count.orders}</p>
              <p className="text-xs text-neutral-500">Orders</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4 text-center">
              <p className="font-heading text-xl font-semibold text-neutral-800">{customer._count.wishlist}</p>
              <p className="text-xs text-neutral-500">Wishlist Items</p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4 text-center">
              <p className="font-heading text-xl font-semibold text-neutral-800">₹{Number(customer.wallet?.balance ?? 0).toLocaleString("en-IN")}</p>
              <p className="text-xs text-neutral-500">Wallet Balance</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-neutral-700">Recent Orders</h3>
            {customer.orders.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-400">No orders yet.</p>
            ) : (
              <div className="mt-2 divide-y divide-neutral-100 rounded-lg border border-neutral-100">
                {customer.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-neutral-800">{o.orderNumber}</p>
                      <p className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status} />
                      <span className="font-medium">₹{Number(o.totalAmount).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-neutral-700">Addresses</h3>
            {customer.addresses.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-400">No saved addresses.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                {customer.addresses.map((a) => (
                  <li key={a.id}>
                    {a.city}, {a.state} {a.isDefault && <span className="text-xs text-royal-600">(Default)</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
