import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";
import type { OrderDetail, OrderListItem, OrderStatus } from "@/admin/types/order";

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus;
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
