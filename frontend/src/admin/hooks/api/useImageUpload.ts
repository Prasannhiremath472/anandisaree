import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export function useImageUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await apiClient.post<{ data: { dataUri: string; sizeBytes: number } }>(
        "/admin/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.data;
    },
  });
}
