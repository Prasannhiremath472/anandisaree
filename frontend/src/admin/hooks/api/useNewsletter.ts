import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";

export interface Subscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
}

export function useSubscribers(params: { page: number; pageSize: number; search?: string }) {
  return useQuery({
    queryKey: ["subscribers", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<Subscriber> }>("/admin/newsletter", { params });
      return res.data.data;
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/newsletter/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}

export function exportSubscribersUrl() {
  return "/api/admin/newsletter/export";
}
