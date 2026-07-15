import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export function useSalesReport(days = 30) {
  return useQuery({
    queryKey: ["report-sales", days],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { series: { date: string; revenue: number }[]; totalRevenue: number } }>(
        "/admin/reports/sales",
        { params: { days } }
      );
      return res.data.data;
    },
  });
}

export function useOrderStatusReport() {
  return useQuery({
    queryKey: ["report-order-status"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: { status: string; count: number }[] }>("/admin/reports/order-status");
      return res.data.data;
    },
  });
}

export function useTopProductsReport() {
  return useQuery({
    queryKey: ["report-top-products"],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: { id: string; name: string; sku: string; soldCount: number; sellingPrice: string; stockQuantity: number }[];
      }>("/admin/reports/top-products");
      return res.data.data;
    },
  });
}

export function useInventoryReport() {
  return useQuery({
    queryKey: ["report-inventory"],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: { id: string; name: string; sku: string; stockQuantity: number; lowStockThreshold: number }[];
      }>("/admin/reports/inventory");
      return res.data.data;
    },
  });
}
