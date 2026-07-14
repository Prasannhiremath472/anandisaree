interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-gold-300/40 bg-royal-700 py-3">
      <div className="animate-marquee flex w-max gap-0 whitespace-nowrap">
        {loopItems.map((item, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-6 font-heading text-xs uppercase tracking-[0.25em] text-cream-100"
          >
            {item}
            <span className="text-gold-400">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
