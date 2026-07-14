const STAT_CARDS = [
  { label: "Revenue (30d)", value: "₹0" },
  { label: "Orders (30d)", value: "0" },
  { label: "Customers", value: "0" },
  { label: "Low Stock Items", value: "0" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-neutral-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-base font-semibold text-neutral-800">Welcome to Anandi Saree Admin</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Sales charts, top products, inventory alerts and latest orders will populate here once
          the Product and Order management modules are built in Phase 4.
        </p>
      </div>
    </div>
  );
}
