import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface DashboardSummary {
  revenue30d: string | number;
  orders30d: number;
  newCustomers30d: number;
  lowStockCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    user: { name: string };
  }[];
  topProducts: { id: string; name: string; soldCount: number; sellingPrice: string }[];
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: DashboardSummary }>("/admin/dashboard");
      return res.data.data;
    },
  });
}
