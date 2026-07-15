import { Link } from "react-router-dom";
import { Image, Mail, MessageCircle, Tag } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { useCoupons } from "@/admin/hooks/api/useCoupons";

const CHANNELS = [
  { label: "Coupons & Offers", description: "Create discount codes and festival campaigns.", to: "/coupons", icon: Tag },
  { label: "Banners", description: "Manage homepage sliders and promotional banners.", to: "/banners", icon: Image },
  { label: "Newsletter", description: "View and export your email subscriber list.", to: "/newsletter", icon: Mail },
];

export function Marketing() {
  const { data: coupons } = useCoupons({ page: 1, pageSize: 5 });
  const festivalCoupons = coupons?.items.filter((c) => c.isFestival) ?? [];

  return (
    <div>
      <PageHeader title="Marketing" description="Campaigns, offers and promotional tools." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-gradient text-white">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-heading text-sm font-semibold text-neutral-800">{c.label}</h3>
            <p className="mt-1 text-sm text-neutral-500">{c.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-black/5 bg-white p-6">
        <h3 className="font-heading text-sm font-semibold text-neutral-800">Active Festival Campaigns</h3>
        {festivalCoupons.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-400">No festival coupons yet. Create one from the Coupons page.</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {festivalCoupons.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono font-medium text-neutral-800">{c.code}</span>
                <span className="text-neutral-500">
                  {c.type === "PERCENTAGE" ? `${c.value}% off` : `₹${c.value} off`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
        <MessageCircle className="mx-auto h-6 w-6 text-neutral-400" />
        <p className="mt-2 text-sm text-neutral-500">
          Abandoned cart recovery, WhatsApp campaigns and push notifications are planned for a future release.
        </p>
      </div>
    </div>
  );
}
