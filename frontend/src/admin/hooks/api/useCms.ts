import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/admin/api/client";
import type { PaginatedResult } from "@/admin/types/api";

export interface CmsPage {
  slug: string;
  title: string;
  contentHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentHtml: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogPostFormValues {
  title: string;
  slug: string;
  excerpt?: string;
  contentHtml: string;
  coverImageUrl?: string;
  isPublished: boolean;
}

export function useCmsPages() {
  return useQuery({
    queryKey: ["cms-pages"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CmsPage[] }>("/admin/cms/pages");
      return res.data.data;
    },
  });
}

export function useUpsertCmsPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, input }: { slug: string; input: { title: string; contentHtml: string; metaTitle?: string; metaDescription?: string } }) => {
      const res = await apiClient.put(`/admin/cms/pages/${slug}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cms-pages"] }),
  });
}

export function useBlogPosts(params: { page: number; pageSize: number; search?: string }) {
  return useQuery({
    queryKey: ["blog-posts", params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: PaginatedResult<BlogPost> }>("/admin/cms/blog", { params });
      return res.data.data;
    },
  });
}

export function useBlogPost(id: string | null) {
  return useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: BlogPost }>(`/admin/cms/blog/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BlogPostFormValues) => {
      const res = await apiClient.post("/admin/cms/blog", input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BlogPostFormValues> }) => {
      const res = await apiClient.put(`/admin/cms/blog/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/cms/blog/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}
