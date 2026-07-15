export function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-neutral-800">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
