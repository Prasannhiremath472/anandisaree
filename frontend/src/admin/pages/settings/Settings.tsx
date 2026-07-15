import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useSettings, useUpsertSettings } from "@/admin/hooks/api/useSettings";

const GROUPS = [
  {
    key: "website",
    label: "Website",
    fields: [
      { key: "site_name", label: "Site Name" },
      { key: "site_tagline", label: "Tagline" },
      { key: "support_email", label: "Support Email" },
      { key: "support_phone", label: "Support Phone" },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    fields: [
      { key: "meta_title", label: "Default Meta Title" },
      { key: "meta_description", label: "Default Meta Description" },
      { key: "google_analytics_id", label: "Google Analytics ID" },
      { key: "meta_pixel_id", label: "Meta Pixel ID" },
    ],
  },
  {
    key: "shipping",
    label: "Shipping",
    fields: [
      { key: "free_shipping_threshold", label: "Free Shipping Above (₹)" },
      { key: "standard_shipping_fee", label: "Standard Shipping Fee (₹)" },
      { key: "delivery_estimate_days", label: "Delivery Estimate (days)" },
    ],
  },
  {
    key: "payment",
    label: "Payment",
    fields: [
      { key: "razorpay_key_id", label: "Razorpay Key ID" },
      { key: "cod_enabled", label: "COD Enabled (true/false)" },
    ],
  },
  {
    key: "social",
    label: "Social Links",
    fields: [
      { key: "facebook_url", label: "Facebook URL" },
      { key: "instagram_url", label: "Instagram URL" },
      { key: "youtube_url", label: "YouTube URL" },
      { key: "whatsapp_number", label: "WhatsApp Number" },
    ],
  },
];

export function Settings() {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].key);
  const { data: settings } = useSettings(activeGroup);
  const upsertMutation = useUpsertSettings();

  const currentGroup = GROUPS.find((g) => g.key === activeGroup)!;
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const field of currentGroup.fields) {
      map[field.key] = settings?.find((s) => s.key === field.key)?.value ?? "";
    }
    setValues(map);
  }, [activeGroup, settings]);

  async function handleSave() {
    try {
      await upsertMutation.mutateAsync(
        currentGroup.fields.map((f) => ({ key: f.key, value: values[f.key] ?? "", group: activeGroup }))
      );
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Configure your store's website, SEO, shipping and payment options." />

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-1">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setActiveGroup(g.key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                activeGroup === g.key ? "bg-royal-gradient text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="col-span-3 space-y-4 rounded-xl border border-black/5 bg-white p-6">
          {currentGroup.fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className={inputClass}
              />
            </Field>
          ))}

          <button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {upsertMutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
