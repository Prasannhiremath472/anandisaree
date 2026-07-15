import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useUpsertCmsPage, type CmsPage } from "@/admin/hooks/api/useCms";

const KNOWN_PAGES = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About Us" },
  { slug: "contact", label: "Contact" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "faq", label: "FAQ" },
];

export function CmsPageEditor({ pages }: { pages: CmsPage[] }) {
  const [activeSlug, setActiveSlug] = useState(KNOWN_PAGES[0].slug);
  const existing = pages.find((p) => p.slug === activeSlug);
  const upsertMutation = useUpsertCmsPage();

  const [form, setForm] = useState({ title: "", contentHtml: "", metaTitle: "", metaDescription: "" });

  useEffect(() => {
    setForm({
      title: existing?.title ?? "",
      contentHtml: existing?.contentHtml ?? "",
      metaTitle: existing?.metaTitle ?? "",
      metaDescription: existing?.metaDescription ?? "",
    });
  }, [activeSlug, existing]);

  async function handleSave() {
    try {
      await upsertMutation.mutateAsync({
        slug: activeSlug,
        input: { title: form.title, contentHtml: form.contentHtml, metaTitle: form.metaTitle, metaDescription: form.metaDescription },
      });
      toast.success("Page saved");
    } catch {
      toast.error("Failed to save page");
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 space-y-1">
        {KNOWN_PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
              activeSlug === p.slug ? "bg-royal-gradient text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="col-span-3 space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <Field label="Page Title" required>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Content (HTML)" required>
          <textarea
            required
            rows={10}
            value={form.contentHtml}
            onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Meta Title">
            <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Meta Description">
            <input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <button
          onClick={handleSave}
          disabled={upsertMutation.isPending}
          className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {upsertMutation.isPending ? "Saving..." : "Save Page"}
        </button>
      </div>
    </div>
  );
}
