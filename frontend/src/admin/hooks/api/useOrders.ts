import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";
import type { OrderDetail, OrderListItem, OrderStatus } from "@/admin/types/order";

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus;
  categoryId?: string;
}

export function useOrders(params: ListParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<OrderListItem> }>("/admin/orders", { params });
      return res.data.data;
    },
  });
}

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: OrderDetail }>(`/admin/orders/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export interface AdminOrderAddressInput {
  type?: "HOME" | "WORK" | "OTHER";
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
}

export interface CreateOrderInput {
  userId?: string;
  addressId?: string;
  newCustomer?: {
    name: string;
    phone: string;
    email?: string;
    address: AdminOrderAddressInput;
  };
  paymentMethod: "COD" | "RAZORPAY" | "UPI" | "CARD" | "NETBANKING" | "WALLET";
  paymentStatus?: "PENDING" | "PAID";
  items: { productId: string; variantId?: string; quantity: number }[];
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const res = await apiClient.post<{ data: OrderDetail }>("/admin/orders", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
      trackingNumber,
      courierName,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
      trackingNumber?: string;
      courierName?: string;
    }) => {
      const res = await apiClient.patch(`/admin/orders/${id}/status`, { status, note, trackingNumber, courierName });
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}
