import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await apiClient.patch<{ data: ProfileUser }>("/auth/me", input);
      return res.data.data;
    },
  });
}
