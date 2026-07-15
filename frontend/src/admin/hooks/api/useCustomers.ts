import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  _count: { orders: number };
}

export interface CustomerDetail extends CustomerListItem {
  addresses: { id: string; city: string; state: string; isDefault: boolean }[];
  orders: { id: string; orderNumber: string; status: string; totalAmount: string; createdAt: string }[];
  wallet: { balance: string } | null;
  _count: { orders: number; reviews: number; wishlist: number };
}

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export function useCustomers(params: ListParams) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<CustomerListItem> }>("/admin/customers", { params });
      return res.data.data;
    },
  });
}

export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CustomerDetail }>(`/admin/customers/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiClient.patch(`/admin/customers/${id}/status`, { isActive });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}
