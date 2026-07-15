import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
  isFeatured: boolean;
  createdAt: string;
  user: { name: string; email: string };
  product: { name: string; images: { url: string }[] };
}

export function useReviews(params: { page: number; pageSize: number; status?: string }) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<Review> }>("/admin/reviews", { params });
      return res.data.data;
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiClient.patch(`/admin/reviews/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useSetReviewFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const res = await apiClient.patch(`/admin/reviews/${id}/featured`, { isFeatured });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
