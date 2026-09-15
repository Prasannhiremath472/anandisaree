import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface AdminNotification {
  id: string;
  type: "ORDER" | "LOW_STOCK" | "REVIEW";
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { items: AdminNotification[]; unreadCount: number } }>(
        "/admin/notifications"
      );
      return res.data.data;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/admin/notifications/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch("/admin/notifications/read-all");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
