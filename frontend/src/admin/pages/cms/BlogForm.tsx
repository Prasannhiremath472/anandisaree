import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/admin/hooks/api/useCms";

const emptyForm = { title: "", slug: "", excerpt: "", contentHtml: "", coverImageUrl: "", isPublished: false };

export function BlogForm() {
  const { t } = useTranslation();
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
        toast.success(t("blogForm.blogPostUpdated"));
      } else {
        await createMutation.mutateAsync(form);
        toast.success(t("blogForm.blogPostCreated"));
      }
      navigate("/cms");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("blogForm.failedToSaveBlogPost"));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">{t("blogForm.loadingPost")}</p>;
  }

  return (
    <div>
      <BackLink to="/cms" label={t("blogForm.backToCms")} />
      <PageHeader title={isEdit ? t("blogForm.editBlogPost") : t("blogForm.newBlogPost")} description={isEdit ? form.title : t("blogForm.writeNewJournalEntry")} />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label={t("common.title")} required>
          <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
        </Field>
        <Field label={t("common.slug")} required>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
        </Field>
        <Field label={t("blogForm.coverImageUrl")}>
          <input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder={t("blogForm.coverImageUrlPlaceholder")} className={inputClass} />
        </Field>
        <Field label={t("blogForm.excerpt")}>
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
        </Field>
        <Field label={t("common.contentHtml")} required>
          <textarea required rows={10} value={form.contentHtml} onChange={(e) => setForm({ ...form, contentHtml: e.target.value })} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
          {t("blogForm.published")}
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/cms")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? t("common.saving") : isEdit ? t("common.saveChanges") : t("blogForm.createPost")}
          </button>
        </div>
      </form>
    </div>
  );
}
