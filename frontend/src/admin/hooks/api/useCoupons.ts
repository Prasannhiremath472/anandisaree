import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FLAT" | "BOGO";
  value: string;
  minOrderAmount: string | null;
  maxDiscount: string | null;
  usageLimit: number | null;
  usedCount: number;
  isFestival: boolean;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

export interface CouponFormValues {
  code: string;
  type: "PERCENTAGE" | "FLAT" | "BOGO";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  isFestival: boolean;
  isActive: boolean;
}

interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export function useCoupons(params: ListParams) {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<Coupon> }>("/admin/coupons", { params });
      return res.data.data;
    },
  });
}

export function useCoupon(id: string | null) {
  return useQuery({
    queryKey: ["coupon", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Coupon }>(`/admin/coupons/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CouponFormValues) => {
      const res = await apiClient.post("/admin/coupons", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CouponFormValues> }) => {
      const res = await apiClient.put(`/admin/coupons/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
  });
}
