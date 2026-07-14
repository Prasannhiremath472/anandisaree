export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "INVENTORY_MANAGER"
  | "ORDER_MANAGER"
  | "CUSTOMER_SUPPORT"
  | "MARKETING_MANAGER"
  | "CONTENT_MANAGER"
  | "CUSTOMER";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export type PaymentMethod = "COD" | "RAZORPAY" | "UPI" | "CARD" | "NETBANKING" | "WALLET";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
