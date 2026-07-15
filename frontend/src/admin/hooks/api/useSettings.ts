import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

export function useSettings(group?: string) {
  return useQuery({
    queryKey: ["settings", group],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Setting[] }>("/admin/settings", { params: group ? { group } : {} });
      return res.data.data;
    },
  });
}

export function useUpsertSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { key: string; value: string; group?: string }[]) => {
      const res = await apiClient.put("/admin/settings", { settings });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });
}
