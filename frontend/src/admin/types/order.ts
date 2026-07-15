export type OrderStatus = "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  totalAmount: string;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  items: { id: string; productName: string; quantity: number }[];
}

export interface OrderDetail extends OrderListItem {
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  shippingAmount: string;
  trackingNumber: string | null;
  courierName: string | null;
  items: {
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    product: { name: string; images: { url: string }[] };
  }[];
  statusHistory: { id: string; status: OrderStatus; note: string | null; createdAt: string }[];
}
