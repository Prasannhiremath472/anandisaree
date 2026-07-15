import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/admin/hooks/api/useCms";

const emptyForm = { title: "", slug: "", excerpt: "", contentHtml: "", coverImageUrl: "", isPublished: false };

export function BlogForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: post, isLoading } = useBlogPost(id ?? null);
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        contentHtml: post.contentHtml,
        coverImageUrl: post.coverImageUrl ?? "",
        isPublished: post.isPublished,
      });
    }
  }, [post]);

  function handleTitleChange(title: string) {
    setForm((f) => ({ ...f, title, slug: isEdit ? f.slug : title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: form });
        toast.success("Blog post updated");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Blog post created");
      }
      navigate("/cms");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save blog post");
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">Loading post...</p>;
  }

  return (
    <div>
      <BackLink to="/cms" label="Back to CMS & Blog" />
      <PageHeader title={isEdit ? "Edit Blog Post" : "New Blog Post"} description={isEdit ? form.title : "Write a new journal entry."} />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label="Title" required>
          <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Slug" required>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Cover Image URL">
          <input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." className={inputClass} />
        </Field>
        <Field label="Excerpt">
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Content (HTML)" required>
          <textarea required rows={10} value={form.contentHtml} onChange={(e) => setForm({ ...form, contentHtml: e.target.value })} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
          Published
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/cms")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
