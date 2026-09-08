import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useSettings, useUpsertSettings } from "@/admin/hooks/api/useSettings";

const GROUPS = [
  {
    key: "website",
    labelKey: "settings.website",
    fields: [
      { key: "site_name", labelKey: "settings.siteName" },
      { key: "site_tagline", labelKey: "settings.tagline" },
      { key: "support_email", labelKey: "settings.supportEmail" },
      { key: "support_phone", labelKey: "settings.supportPhone" },
    ],
  },
  {
    key: "seo",
    labelKey: "settings.seo",
    fields: [
      { key: "meta_title", labelKey: "settings.defaultMetaTitle" },
      { key: "meta_description", labelKey: "settings.defaultMetaDescription" },
      { key: "google_analytics_id", labelKey: "settings.googleAnalyticsId" },
      { key: "meta_pixel_id", labelKey: "settings.metaPixelId" },
    ],
  },
  {
    key: "shipping",
    labelKey: "settings.shipping",
    fields: [
      { key: "free_shipping_threshold", labelKey: "settings.freeShippingAbove" },
      { key: "standard_shipping_fee", labelKey: "settings.standardShippingFee" },
      { key: "delivery_estimate_days", labelKey: "settings.deliveryEstimateDays" },
    ],
  },
  {
    key: "payment",
    labelKey: "settings.payment",
    fields: [
      { key: "razorpay_key_id", labelKey: "settings.razorpayKeyId" },
      { key: "cod_enabled", labelKey: "settings.codEnabled" },
    ],
  },
  {
    key: "social",
    labelKey: "settings.socialLinks",
    fields: [
      { key: "facebook_url", labelKey: "settings.facebookUrl" },
      { key: "instagram_url", labelKey: "settings.instagramUrl" },
      { key: "youtube_url", labelKey: "settings.youtubeUrl" },
      { key: "whatsapp_number", labelKey: "settings.whatsappNumber" },
    ],
  },
];

export function Settings() {
  const { t } = useTranslation();
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
      toast.success(t("settings.settingsSaved"));
    } catch {
      toast.error(t("settings.failedToSaveSettings"));
    }
  }

  return (
    <div>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

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
              {t(g.labelKey)}
            </button>
          ))}
        </div>

        <div className="col-span-3 space-y-4 rounded-xl border border-black/5 bg-white p-6">
          {currentGroup.fields.map((f) => (
            <Field key={f.key} label={t(f.labelKey)}>
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
            {upsertMutation.isPending ? t("common.saving") : t("settings.saveSettings")}
          </button>
        </div>
      </div>
    </div>
  );
}
