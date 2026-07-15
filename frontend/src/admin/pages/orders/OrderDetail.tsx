import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useOrder, useUpdateOrderStatus } from "@/admin/hooks/api/useOrders";
import type { OrderStatus } from "@/admin/types/order";

const STATUS_FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
const ALL_STATUSES: OrderStatus[] = [...STATUS_FLOW, "CANCELLED", "RETURNED", "REFUNDED"];

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id ?? null);
  const updateMutation = useUpdateOrderStatus();
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");

  async function handleStatusUpdate() {
    if (!id || !nextStatus) return;
    try {
      await updateMutation.mutateAsync({ id, status: nextStatus, trackingNumber: trackingNumber || undefined, courierName: courierName || undefined });
      toast.success(`Order marked as ${nextStatus.toLowerCase()}`);
      setNextStatus("");
    } catch {
      toast.error("Failed to update order status");
    }
  }

  return (
    <div>
      <BackLink to="/orders" label="Back to Orders" />
      <PageHeader title={order ? `Order ${order.orderNumber}` : "Order"} />

      {isLoading || !order ? (
        <p className="py-10 text-center text-neutral-400">Loading...</p>
      ) : (
        <div className="max-w-4xl space-y-6 rounded-xl border border-black/5 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-heading text-sm font-semibold text-neutral-700">Customer</h3>
              <p className="mt-1 text-sm text-neutral-600">{order.user.name}</p>
              <p className="text-sm text-neutral-500">{order.user.email}</p>
              <p className="text-sm text-neutral-500">{order.user.phone}</p>
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-neutral-700">Shipping Address</h3>
              <p className="mt-1 text-sm text-neutral-600">{order.address.fullName}</p>
              <p className="text-sm text-neutral-500">
                {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p className="text-sm text-neutral-500">{order.address.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-neutral-700">Items</h3>
            <div className="mt-2 divide-y divide-neutral-100 rounded-lg border border-neutral-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]?.url ?? "https://placehold.co/60x80"}
                      alt={item.productName}
                      className="h-12 w-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-neutral-800">{item.productName}</p>
                      <p className="text-xs text-neutral-400">
                        {item.sku} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-neutral-700">₹{Number(item.totalPrice).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 rounded-lg bg-neutral-50 p-4 text-sm">
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Discount</span><span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span>₹{Number(order.taxAmount).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>₹{Number(order.shippingAmount).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between border-t border-neutral-200 pt-1 font-semibold"><span>Total</span><span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span></div>
            </div>
            <div>
              <h4 className="font-heading text-xs font-semibold uppercase text-neutral-500">Status Timeline</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-neutral-600">
                {order.statusHistory.map((h) => (
                  <li key={h.id} className="flex justify-between">
                    <span>{h.status}</span>
                    <span className="text-neutral-400">{new Date(h.createdAt).toLocaleDateString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <h3 className="font-heading text-sm font-semibold text-neutral-700">Update Status</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Field label="New Status">
                <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as OrderStatus)} className={inputClass}>
                  <option value="">Select status</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tracking Number">
                <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Courier">
                <input value={courierName} onChange={(e) => setCourierName(e.target.value)} className={inputClass} />
              </Field>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={!nextStatus || updateMutation.isPending}
              className="mt-4 rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {updateMutation.isPending ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
