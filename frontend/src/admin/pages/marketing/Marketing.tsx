import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image, Mail, MessageCircle, Tag } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { useCoupons } from "@/admin/hooks/api/useCoupons";

const CHANNELS = [
  { labelKey: "marketing.couponsAndOffers", descriptionKey: "marketing.createDiscountCodesDescription", to: "/coupons", icon: Tag },
  { labelKey: "nav.banners", descriptionKey: "marketing.manageBannersDescription", to: "/banners", icon: Image },
  { labelKey: "nav.newsletter", descriptionKey: "marketing.viewExportSubscribersDescription", to: "/newsletter", icon: Mail },
];

export function Marketing() {
  const { t } = useTranslation();
  const { data: coupons } = useCoupons({ page: 1, pageSize: 5 });
  const festivalCoupons = coupons?.items.filter((c) => c.isFestival) ?? [];

  return (
    <div>
      <PageHeader title={t("marketing.title")} description={t("marketing.description")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-gradient text-white">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-heading text-sm font-semibold text-neutral-800">{t(c.labelKey)}</h3>
            <p className="mt-1 text-sm text-neutral-500">{t(c.descriptionKey)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-black/5 bg-white p-6">
        <h3 className="font-heading text-sm font-semibold text-neutral-800">{t("marketing.activeFestivalCampaigns")}</h3>
        {festivalCoupons.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-400">{t("marketing.noFestivalCoupons")}</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {festivalCoupons.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono font-medium text-neutral-800">{c.code}</span>
                <span className="text-neutral-500">
                  {c.type === "PERCENTAGE" ? t("marketing.percentOff", { value: c.value }) : t("marketing.amountOff", { value: c.value })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
        <MessageCircle className="mx-auto h-6 w-6 text-neutral-400" />
        <p className="mt-2 text-sm text-neutral-500">
          {t("marketing.comingSoon")}
        </p>
      </div>
    </div>
  );
}
