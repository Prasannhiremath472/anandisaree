import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useBlogPosts, useCmsPages, useDeleteBlogPost, type BlogPost } from "@/admin/hooks/api/useCms";
import { CmsPageEditor } from "./CmsPageEditor";

export function CmsAndBlog() {
  const [tab, setTab] = useState<"pages" | "blog">("pages");
  const { data: pages } = useCmsPages();

  const [page, setPage] = useState(1);
  const { data: posts, isLoading } = useBlogPosts({ page, pageSize: 10 });
  const deleteMutation = useDeleteBlogPost();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Blog post deleted");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete post");
    }
  }

  const columns: Column<BlogPost>[] = [
    { header: "Title", key: "title", render: (p) => <span className="font-medium text-neutral-800">{p.title}</span> },
    { header: "Slug", key: "slug" },
    { header: "Created", key: "createdAt", render: (p) => new Date(p.createdAt).toLocaleDateString("en-IN") },
    { header: "Status", key: "isPublished", render: (p) => <StatusBadge status={p.isPublished ? "ACTIVE" : "INACTIVE"} /> },
    {
      header: "Actions",
      key: "actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/cms/blog/${p.id}/edit`)} aria-label="Edit" className="text-neutral-500 hover:text-royal-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingId(p.id)} aria-label="Delete" className="text-neutral-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="CMS & Blog"
        description="Manage static pages and blog content."
        actions={
          tab === "blog" ? (
            <Link
              to="/cms/blog/new"
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> New Post
            </Link>
          ) : undefined
        }
      />

      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        {(["pages", "blog"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t ? "border-royal-600 text-royal-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t === "pages" ? "Static Pages" : "Blog Posts"}
          </button>
        ))}
      </div>

      {tab === "pages" ? (
        <CmsPageEditor pages={pages ?? []} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={posts?.items ?? []}
            rowKey={(p) => p.id}
            loading={isLoading}
            emptyMessage="No blog posts yet."
            onRowClick={(p) => navigate(`/cms/blog/${p.id}/edit`)}
          />
          {posts && posts.total > 0 && (
            <Pagination page={posts.page} totalPages={posts.totalPages} total={posts.total} pageSize={posts.pageSize} onPageChange={setPage} />
          )}
          <ConfirmDialog
            open={Boolean(deletingId)}
            onOpenChange={(open) => !open && setDeletingId(null)}
            title="Delete blog post?"
            description="This post will be permanently removed."
            confirmLabel="Delete"
            onConfirm={confirmDelete}
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
